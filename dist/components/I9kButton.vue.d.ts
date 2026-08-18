type Variant = 'default' | 'primary' | 'link' | 'filter' | 'pagination' | 'page';
type __VLS_Props = {
    to?: string | Record<string, unknown> | null;
    href?: string | null;
    variant?: Variant;
    active?: boolean;
    type?: 'button' | 'submit' | 'reset';
    linkComponent?: string | object | null;
};
declare var __VLS_8: {};
type __VLS_Slots = {} & {
    default?: (props: typeof __VLS_8) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{}>, {
    type: "button" | "submit" | "reset";
    href: string | null;
    to: string | Record<string, unknown> | null;
    variant: Variant;
    active: boolean;
    linkComponent: string | object | null;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=I9kButton.vue.d.ts.map