import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import ts from 'typescript';

export interface AliasEntry {
  /** Right-hand side text, present only when the alias is a literal union. */
  inline: string | null;
  /** Full declaration text, always present. */
  declaration: string;
}

const LITERAL_KINDS = new Set<ts.SyntaxKind>([
  ts.SyntaxKind.LiteralType,
  ts.SyntaxKind.StringKeyword,
  ts.SyntaxKind.NumberKeyword,
  ts.SyntaxKind.BooleanKeyword,
  ts.SyntaxKind.NullKeyword,
  ts.SyntaxKind.UndefinedKeyword,
]);

const isInlineable = (node: ts.TypeNode): boolean => {
  if (ts.isUnionTypeNode(node)) return node.types.every(isInlineable);
  return LITERAL_KINDS.has(node.kind);
};

/** Collects `type X = …` and `interface X {…}` declarations from one source text. */
export const collectAliases = (source: string, fileName: string): Map<string, AliasEntry> => {
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.ES2022, true);
  const aliases = new Map<string, AliasEntry>();

  sourceFile.forEachChild((node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      aliases.set(node.name.text, {
        inline: isInlineable(node.type) ? node.type.getText(sourceFile) : null,
        declaration: node.getText(sourceFile),
      });
      return;
    }
    if (ts.isInterfaceDeclaration(node)) {
      aliases.set(node.name.text, { inline: null, declaration: node.getText(sourceFile) });
    }
  });

  return aliases;
};

/** Aliases exported from `src/types/*.ts`, read once and cached. */
let sharedAliases: Map<string, AliasEntry> | null = null;

export const sharedTypeAliases = (typesDir = resolve('src/types')): Map<string, AliasEntry> => {
  if (sharedAliases) return sharedAliases;

  sharedAliases = new Map();
  for (const file of readdirSync(typesDir).filter((name) => name.endsWith('.ts'))) {
    const path = join(typesDir, file);
    for (const [name, entry] of collectAliases(readFileSync(path, 'utf8'), path)) {
      sharedAliases.set(name, entry);
    }
  }
  return sharedAliases;
};

/**
 * Replaces whole-word alias references with their literal union when the alias is
 * inlineable, and reports every alias that stayed by name so the caller can record
 * its declaration.
 */
export const resolveTypeText = (
  typeText: string,
  aliases: Map<string, AliasEntry>,
): { text: string; referenced: string[] } => {
  const referenced: string[] = [];
  const text = typeText.replace(/\b[A-Z][A-Za-z0-9_]*\b/g, (name) => {
    const entry = aliases.get(name);
    if (!entry) return name;
    if (entry.inline) return entry.inline;
    referenced.push(name);
    return name;
  });
  return { text, referenced };
};
