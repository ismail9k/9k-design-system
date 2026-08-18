import { type I9kIconName } from './I9kIcon.vue';
export interface I9kSocialLink {
    name: string;
    url: string;
    label?: string;
    icon?: I9kIconName;
}
type __VLS_Props = {
    items: I9kSocialLink[];
    labels?: boolean;
    followLabel?: (platform: string) => string;
};
declare var __VLS_1: {
    item: I9kSocialLink;
};
type __VLS_Slots = {} & {
    icon?: (props: typeof __VLS_1) => any;
};
declare const __VLS_base: import("vue").DefineComponent<__VLS_Props, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (item: I9kSocialLink, event: MouseEvent) => any;
}, string, import("vue").PublicProps, Readonly<__VLS_Props> & Readonly<{
    onClick?: ((item: I9kSocialLink, event: MouseEvent) => any) | undefined;
}>, {
    labels: boolean;
    followLabel: (platform: string) => string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
//# sourceMappingURL=I9kSocialLinks.vue.d.ts.map