import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

import ts from 'typescript';
import { parse as parseSfc } from 'vue/compiler-sfc';

import type { AliasEntry } from './aliases';
import { collectAliases, resolveTypeText, sharedTypeAliases } from './aliases';
import type { ExtractedComponent, ExtractedProp } from './types';

/** Finds the first call to `name` anywhere in the script setup block. */
const findCall = (sourceFile: ts.SourceFile, name: string): ts.CallExpression | null => {
  let found: ts.CallExpression | null = null;
  const visit = (node: ts.Node) => {
    if (found) return;
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === name
    ) {
      found = node;
      return;
    }
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(sourceFile, visit);
  return found;
};

/** Reads the `{ key: value }` second argument of `withDefaults`, as source text. */
const readDefaults = (sourceFile: ts.SourceFile): Map<string, string> => {
  const defaults = new Map<string, string>();
  const call = findCall(sourceFile, 'withDefaults');
  const argument = call?.arguments[1];
  if (!argument || !ts.isObjectLiteralExpression(argument)) return defaults;

  for (const property of argument.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    defaults.set(property.name.getText(sourceFile), property.initializer.getText(sourceFile));
  }
  return defaults;
};

const propertyName = (node: ts.PropertySignature, sourceFile: ts.SourceFile): string =>
  ts.isStringLiteral(node.name) ? node.name.text : node.name.getText(sourceFile);

export const extractComponent = (filePath: string): ExtractedComponent => {
  const source = readFileSync(filePath, 'utf8');
  const { descriptor } = parseSfc(source, { filename: filePath });
  const scriptSetup = descriptor.scriptSetup?.content ?? '';
  const sourceFile = ts.createSourceFile(filePath, scriptSetup, ts.ScriptTarget.ES2022, true);

  const aliases = new Map<string, AliasEntry>([
    ...sharedTypeAliases(),
    ...collectAliases(scriptSetup, filePath),
  ]);

  const referencedTypes: Record<string, string> = {};
  const record = (names: string[]) => {
    for (const name of names) {
      const entry = aliases.get(name);
      if (entry) referencedTypes[name] = entry.declaration;
    }
  };

  const props: ExtractedProp[] = [];
  const defaults = readDefaults(sourceFile);
  const propsType = findCall(sourceFile, 'defineProps')?.typeArguments?.[0];

  if (propsType && ts.isTypeLiteralNode(propsType)) {
    for (const member of propsType.members) {
      if (!ts.isPropertySignature(member) || !member.type) continue;
      const name = propertyName(member, sourceFile);
      const resolved = resolveTypeText(member.type.getText(sourceFile), aliases);
      record(resolved.referenced);
      props.push({
        name,
        type: resolved.text,
        required: member.questionToken === undefined,
        default: defaults.get(name) ?? null,
      });
    }
  }

  return {
    name: basename(filePath, '.vue'),
    props,
    emits: [],
    slots: [],
    referencedTypes,
  };
};
