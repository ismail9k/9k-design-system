import { type I9kSocialLink } from './I9kSocialLinks.vue';
type __VLS_Props = {
    tagline?: string | null;
    socialLinks?: I9kSocialLink[];
    socialLabels?: boolean;
};
declare var __VLS_10: {
    item: I9kSocialLink;
}, __VLS_12: {};
type __VLS_Slots = {} & {
    'social-icon'?: (props: typeof __VLS_10) => any;
} & {
    default?: (props: typeof __VLS_12) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    socialClick: (item: I9kSocialLink, event: MouseEvent) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onSocialClick?: ((item: I9kSocialLink, event: MouseEvent) => any) | undefined;
}>, {
    tagline: string | null;
    socialLinks: I9kSocialLink[];
    socialLabels: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=I9kFooter.vue.d.ts.map