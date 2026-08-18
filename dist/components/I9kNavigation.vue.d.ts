export interface I9kNavigationLink {
    id: string;
    label: string;
    href: string;
}
type __VLS_Props = {
    links: I9kNavigationLink[];
    brandHref?: string;
    brandLabel?: string;
    compactAt?: number;
    expandAt?: number;
};
declare var __VLS_1: {
    compact: boolean;
}, __VLS_3: {};
type __VLS_Slots = {} & {
    brand?: (props: typeof __VLS_1) => any;
} & {
    actions?: (props: typeof __VLS_3) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    navigate: (link: I9kNavigationLink, event: MouseEvent) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onNavigate?: ((link: I9kNavigationLink, event: MouseEvent) => any) | undefined;
}>, {
    brandHref: string;
    brandLabel: string;
    compactAt: number;
    expandAt: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=I9kNavigation.vue.d.ts.map