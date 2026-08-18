import { Fragment as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createStaticVNode as o, createTextVNode as s, defineComponent as c, guardReactiveProps as l, mergeProps as u, normalizeClass as d, normalizeProps as f, onMounted as p, onUnmounted as m, openBlock as h, ref as g, renderList as _, renderSlot as v, resolveDynamicComponent as y, toDisplayString as b, unref as x, useAttrs as S, watch as C, withCtx as w } from "vue";
//#region src/components/I9kArticleHeader.vue?vue&type=script&setup=true&lang.ts
var T = {
	key: 0,
	class: "i9k-article-header"
}, E = [
	"src",
	"alt",
	"loading",
	"fetchpriority"
], D = {
	key: 1,
	class: "i9k-article-header i9k-article-header--fallback",
	"aria-hidden": "true"
}, O = /*@__PURE__*/ c({
	__name: "I9kArticleHeader",
	props: {
		title: {},
		imageSrc: { default: null },
		imageAlt: { default: "" },
		watermark: { default: "9k" },
		eager: {
			type: Boolean,
			default: !1
		}
	},
	setup(e) {
		let n = e, r = t(() => n.imageAlt || `${n.title} article header`);
		return (t, n) => e.imageSrc ? (h(), i("figure", T, [a("img", {
			src: e.imageSrc,
			alt: r.value,
			width: "1200",
			height: "600",
			loading: e.eager ? "eager" : "lazy",
			fetchpriority: e.eager ? "high" : void 0
		}, null, 8, E)])) : (h(), i("div", D, [a("span", null, "#" + b(e.watermark), 1)]));
	}
}), k = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, A = /*#__PURE__*/ k(O, [["__scopeId", "data-v-7452a444"]]), j = ["aria-label"], M = /* @__PURE__ */ c({
	__name: "I9kAsciiEmoji",
	props: {
		name: {},
		label: { default: null },
		size: { default: "md" },
		color: { default: "primary" }
	},
	setup(e) {
		let n = {
			"^_^": "happy",
			"·ᴗ·": "gentle smile",
			"◡̈": "smiling",
			">‿<": "joyful",
			x_x: "exhausted",
			o_o: "surprised",
			"-_-": "unimpressed"
		}, r = e, a = t(() => r.label ?? n[r.name]);
		return (t, n) => (h(), i("span", {
			class: d(["emoticon", [`emoticon--${e.size}`, `emoticon--${e.color}`]]),
			role: "img",
			"aria-label": a.value
		}, b(e.name), 11, j));
	}
}), N = {}, P = {
	class: "i9k-blurred-circles",
	"aria-hidden": "true"
};
function F(t, n) {
	return h(), i("div", P, [(h(), i(e, null, _(4, (e) => a("i", {
		key: e,
		class: d(["i9k-blurred-circle", `i9k-blurred-circle--${e}`])
	}, null, 2)), 64))]);
}
var ee = /*#__PURE__*/ k(N, [["render", F], ["__scopeId", "data-v-ea92c700"]]), te = ["data-reserved"], ne = { class: "brand-current" }, re = { class: "brand-letter" }, I = "Ismail", L = "9k", R = 90, z = 45, B = "(prefers-reduced-motion: reduce)", V = 15e3, H = 2e3, U = /*#__PURE__*/ k({
	__name: "I9kBrandWordmark",
	props: { compact: {
		type: Boolean,
		default: !1
	} },
	setup(e) {
		let n = e, r = `${I}${L}`, o = L, s = [
			"^_^",
			"·ᴗ·",
			"◡̈",
			">‿<",
			"x_x",
			"o_o",
			"-_-"
		], c = t(() => n.compact ? o : r), l = t(() => n.compact ? "" : I), u = g(r), f = g(!0), _ = t(() => `${f.value ? c.value : r}_`), v = 0, y, x, S, w = () => S?.matches ?? !1, T = (e) => new Promise((t) => {
			let n = () => {
				y !== void 0 && window.clearTimeout(y), y = void 0, x = void 0, t();
			};
			y = window.setTimeout(n, e), x = n;
		}), E = () => {
			v += 1, x?.();
		}, D = (e) => {
			u.value = e, f.value = !0;
		}, O = async (e, t, n = "") => {
			for (let r = 1; r <= e.length; r += 1) if (u.value = n + e.slice(0, r), await T(R), !t()) return !1;
			return !0;
		}, k = async (e, t = 0) => {
			let n = u.value;
			for (let r = n.length - 1; r >= t; --r) if (u.value = n.slice(0, r), await T(z), !e()) return !1;
			return !0;
		}, A = async () => {
			v += 1;
			let e = v, t = () => e === v;
			f.value = !1, await k(t) && await O(c.value, t) && (f.value = !0);
		}, j = async () => {
			v += 1;
			let e = v, t = () => e === v, n = l.value, r = s[Math.floor(Math.random() * s.length)];
			f.value = !1, await k(t, n.length) && await O(r, t, n) && (f.value = !0, await T(H), t() && (f.value = !1, await k(t, n.length) && await O(L, t, n) && (f.value = !0)));
		}, M, N = () => {
			let e = V + Math.random() * 2e4;
			M = window.setTimeout(async () => {
				n.compact && f.value && !w() && document.visibilityState === "visible" && await j(), N();
			}, e);
		};
		C(c, (e) => {
			if (E(), w()) {
				D(e);
				return;
			}
			A();
		});
		let P = () => {
			w() && (E(), D(c.value));
		};
		return p(() => {
			S = window.matchMedia(B), S.addEventListener("change", P), u.value !== c.value && D(c.value), N();
		}), m(() => {
			E(), M !== void 0 && window.clearTimeout(M), S?.removeEventListener("change", P);
		}), (e, t) => (h(), i("span", {
			class: "brand-visual",
			"data-reserved": _.value,
			"aria-hidden": "true"
		}, [a("span", ne, [a("span", re, b(u.value), 1), a("span", { class: d(["brand-cursor", { "is-blinking": f.value }]) }, "_", 2)])], 8, te));
	}
}, [["__scopeId", "data-v-79b5ec8c"]]), W = { class: "i9k-faq-list" }, G = { class: "i9k-faq-question" }, K = { class: "i9k-faq-answer" }, q = /*#__PURE__*/ k(/* @__PURE__ */ c({
	__name: "I9kFaqList",
	props: { items: {} },
	setup(t) {
		return (n, r) => (h(), i("div", W, [(h(!0), i(e, null, _(t.items, (e) => (h(), i("details", {
			key: e.question,
			class: "i9k-faq-item"
		}, [a("summary", G, b(e.question), 1), a("p", K, b(e.answer), 1)]))), 128))]));
	}
}), [["__scopeId", "data-v-a25782d7"]]), J = {
	facebook: "M17,2V2H17V6H15C14.31,6 14,6.81 14,7.5V10H14L17,10V14H14V22H10V14H7V10H10V6A4,4 0 0,1 14,2H17Z",
	twitter: "M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z",
	medium: "M4.37,7.3C4.4,7.05 4.3,6.81 4.12,6.65L2.25,4.4V4.06H8.05L12.53,13.89L16.47,4.06H22V4.4L20.4,5.93C20.27,6.03 20.2,6.21 20.23,6.38V17.62C20.2,17.79 20.27,17.97 20.4,18.07L21.96,19.6V19.94H14.12V19.6L15.73,18.03C15.89,17.88 15.89,17.83 15.89,17.59V8.5L11.4,19.9H10.8L5.57,8.5V16.14C5.5,16.46 5.63,16.78 5.86,17L7.96,19.57V19.9H2V19.57L4.1,17C4.33,16.78 4.43,16.46 4.37,16.14V7.3Z",
	linkedin: "M21,21H17V14.25C17,13.19 15.81,12.31 14.75,12.31C13.69,12.31 13,13.19 13,14.25V21H9V9H13V11C13.66,9.93 15.36,9.24 16.5,9.24C19,9.24 21,11.28 21,13.75V21M7,21H3V9H7V21M5,3A2,2 0 0,1 7,5A2,2 0 0,1 5,7A2,2 0 0,1 3,5A2,2 0 0,1 5,3Z",
	behance: "M19.58,12.27C19.54,11.65 19.33,11.18 18.96,10.86C18.59,10.54 18.13,10.38 17.58,10.38C17,10.38 16.5,10.55 16.19,10.89C15.86,11.23 15.65,11.69 15.57,12.27M21.92,12.04C22,12.45 22,13.04 22,13.81H15.5C15.55,14.71 15.85,15.33 16.44,15.69C16.79,15.92 17.22,16.03 17.73,16.03C18.26,16.03 18.69,15.89 19,15.62C19.2,15.47 19.36,15.27 19.5,15H21.88C21.82,15.54 21.53,16.07 21,16.62C20.22,17.5 19.1,17.92 17.66,17.92C16.47,17.92 15.43,17.55 14.5,16.82C13.62,16.09 13.16,14.9 13.16,13.25C13.16,11.7 13.57,10.5 14.39,9.7C15.21,8.87 16.27,8.46 17.58,8.46C18.35,8.46 19.05,8.6 19.67,8.88C20.29,9.16 20.81,9.59 21.21,10.2C21.58,10.73 21.81,11.34 21.92,12.04M9.58,14.07C9.58,13.42 9.31,12.97 8.79,12.73C8.5,12.6 8.08,12.53 7.54,12.5H4.87V15.84H7.5C8.04,15.84 8.46,15.77 8.76,15.62C9.31,15.35 9.58,14.83 9.58,14.07M4.87,10.46H7.5C8.04,10.46 8.5,10.36 8.82,10.15C9.16,9.95 9.32,9.58 9.32,9.06C9.32,8.5 9.1,8.1 8.66,7.91C8.27,7.78 7.78,7.72 7.19,7.72H4.87M11.72,12.42C12.04,12.92 12.2,13.53 12.2,14.24C12.2,15 12,15.64 11.65,16.23C11.41,16.62 11.12,16.94 10.77,17.21C10.37,17.5 9.9,17.72 9.36,17.83C8.82,17.94 8.24,18 7.61,18H2V5.55H8C9.53,5.58 10.6,6 11.23,6.88C11.61,7.41 11.8,8.04 11.8,8.78C11.8,9.54 11.61,10.15 11.23,10.61C11,10.87 10.7,11.11 10.28,11.32C10.91,11.55 11.39,11.92 11.72,12.42M20.06,7.32H15.05V6.07H20.06V7.32Z",
	github: "M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z",
	menu: "M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z",
	mail: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
	dev: "M6.4,9.4C6.2,9.3,6,9.2,5.8,9.2H4.9v5.6h0.9c0.2,0,0.4-0.1,0.6-0.2c0.2-0.2,0.3-0.4,0.3-0.7v-3.7C6.7,9.8,6.6,9.6 6.4,9.4 L6.4,9.4z M21.6,0H2.4C1.1,0,0,1,0,2.3v19.3C0,23,1.1,24,2.4,24h19.3c1.3,0,2.3-1,2.4-2.3V2.3C24,1,22.9,0,21.6,0z M8.3,13.9 c0,1-0.6,2.5-2.6,2.5H3.2V7.6h2.5c1.9,0,2.5,1.5,2.5,2.5L8.3,13.9L8.3,13.9z M13.7,9.1h-2.9v2.1h1.7v1.6h-1.7v2.1h2.9v1.6h-3.3 c-0.6,0-1.1-0.5-1.1-1.1V8.7c0-0.6,0.5-1.1,1.1-1.1h3.4L13.7,9.1L13.7,9.1z M19.2,15.3c-0.7,1.6-2,1.3-2.5,0l-2.1-7.8h1.7l1.6,6.1 l1.6-6.1h1.7L19.2,15.3L19.2,15.3z",
	phone: "M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z",
	landMark: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
	home: "M19.07,4.93C17.22,3 14.66,1.96 12,2C9.34,1.96 6.79,3 4.94,4.93C3,6.78 1.96,9.34 2,12C1.96,14.66 3,17.21 4.93,19.06C6.78,21 9.34,22.04 12,22C14.66,22.04 17.21,21 19.06,19.07C21,17.22 22.04,14.66 22,12C22.04,9.34 21,6.78 19.07,4.93M17,12V18H13.5V13H10.5V18H7V12H5L12,5L19.5,12H17Z",
	instagram: "M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z",
	youtube: "M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z",
	tiktok: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
	x: {
		viewBox: "0 0 16 16",
		path: "M9.33 6.92L14.54.99H13.3L8.77 6.13 5.15.98H.98l5.46 7.78 -5.47 6.21H2.2l4.77-5.44 3.81 5.43h4.16L9.27 6.88Zm-1.7 1.92l-.56-.78 -4.41-6.17h1.89L8.1 6.86l.55.77 4.62 6.46h-1.9L7.59 8.8Z"
	},
	"9klabs": {
		viewBox: "0 0 1024 1024",
		path: "M845.24,131.05L584.03,9.24c-21.02-9.8-44.82-11.88-67.22-5.88L238.42,77.96c-22.4,6-41.97,19.71-55.27,38.7L17.84,352.75C4.54,371.74-1.65,394.82.38,417.92l25.12,287.11c2.02,23.1,12.12,44.76,28.52,61.15l203.8,203.8c16.4,16.4,38.05,26.5,61.15,28.52l287.11,25.12c23.1,2.02,46.18-4.16,65.18-17.46l236.09-165.31c19-13.3,32.7-32.87,38.7-55.27l74.59-278.39c6-22.4,3.92-46.2-5.88-67.22l-121.8-261.21c-9.8-21.02-26.69-37.91-47.71-47.71Z"
	},
	linktree: "m13.73635 5.85251 4.00467-4.11665 2.3248 2.3808-4.20064 4.00466h5.9085v3.30473h-5.9365l4.22865 4.10766-2.3248 2.3338L12.0005 12.099l-5.74052 5.76852-2.3248-2.3248 4.22864-4.10766h-5.9375V8.12132h5.9085L3.93417 4.11666l2.3248-2.3808 4.00468 4.11665V0h3.4727zm-3.4727 10.30614h3.4727V24h-3.4727z"
}, Y = [
	"viewBox",
	"width",
	"height",
	"role",
	"aria-hidden"
], X = { key: 0 }, ie = { key: 1 }, ae = ["d"], Z = /*#__PURE__*/ k(/* @__PURE__ */ c({
	__name: "I9kIcon",
	props: {
		name: {},
		title: { default: "" },
		desc: { default: "" },
		size: { default: "1.2em" }
	},
	setup(e) {
		let t = e, n = J[t.name], o = typeof n == "string" ? "0 0 24 24" : n.viewBox, s = typeof n == "string" ? n : n.path, c = !t.title && !t.desc;
		return (t, n) => (h(), i("svg", u({
			class: "i9k-icon",
			viewBox: x(o),
			width: e.size,
			height: e.size,
			role: x(c) ? void 0 : "img",
			"aria-hidden": x(c) ? "true" : void 0
		}, t.$attrs), [
			e.title ? (h(), i("title", X, b(e.title), 1)) : r("", !0),
			e.desc ? (h(), i("desc", ie, b(e.desc), 1)) : r("", !0),
			a("path", { d: x(s) }, null, 8, ae)
		], 16, Y));
	}
}), [["__scopeId", "data-v-664de58d"]]), oe = { class: "social-links" }, se = [
	"href",
	"aria-label",
	"onClick"
], ce = {
	key: 1,
	class: "social-link__initial",
	"aria-hidden": "true"
}, le = {
	key: 0,
	class: "social-link-label"
}, Q = /*#__PURE__*/ k(/* @__PURE__ */ c({
	__name: "I9kSocialLinks",
	props: {
		items: {},
		labels: {
			type: Boolean,
			default: !1
		},
		followLabel: {
			type: Function,
			default: (e) => `Follow on ${e}`
		}
	},
	emits: ["click"],
	setup(t) {
		return (o, s) => (h(), i("ul", oe, [(h(!0), i(e, null, _(t.items, (e) => (h(), i("li", { key: e.name }, [a("a", {
			class: d(["social-link", { "has-label": t.labels }]),
			href: e.url,
			target: "_blank",
			rel: "noopener",
			"aria-label": t.followLabel(e.name),
			onClick: (t) => o.$emit("click", e, t)
		}, [v(o.$slots, "icon", { item: e }, () => [e.icon ? (h(), n(Z, {
			key: 0,
			name: e.icon,
			title: e.name
		}, null, 8, ["name", "title"])) : (h(), i("span", ce, b(e.name.slice(0, 1)), 1))], !0), t.labels ? (h(), i("span", le, b(e.label ?? e.name), 1)) : r("", !0)], 10, se)]))), 128))]));
	}
}), [["__scopeId", "data-v-ae39d22f"]]), ue = { class: "footer" }, de = {
	key: 0,
	class: "footer-tagline"
}, fe = /*#__PURE__*/ k(/* @__PURE__ */ c({
	__name: "I9kFooter",
	props: {
		tagline: { default: null },
		socialLinks: { default: () => [] },
		socialLabels: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["socialClick"],
	setup(e) {
		return (t, a) => (h(), i("footer", ue, [e.socialLinks.length ? (h(), n(Q, {
			key: 0,
			class: "footer-socials",
			items: e.socialLinks,
			labels: e.socialLabels,
			onClick: a[0] ||= (e, n) => t.$emit("socialClick", e, n)
		}, {
			icon: w((e) => [v(t.$slots, "social-icon", f(l(e)), void 0, !0)]),
			_: 3
		}, 8, ["items", "labels"])) : r("", !0), v(t.$slots, "default", {}, () => [e.tagline ? (h(), i("p", de, b(e.tagline), 1)) : r("", !0)], !0)]));
	}
}), [["__scopeId", "data-v-26b1d1d7"]]), pe = ["href", "hreflang"], me = /*#__PURE__*/ k(/* @__PURE__ */ c({
	__name: "I9kLanguageSwitcher",
	props: {
		label: {},
		href: {},
		hreflang: { default: null }
	},
	setup(e) {
		return (t, n) => (h(), i("a", {
			class: "language-switcher",
			href: e.href,
			hreflang: e.hreflang ?? void 0
		}, [v(t.$slots, "default", {}, () => [s(b(e.label), 1)], !0)], 8, pe));
	}
}), [["__scopeId", "data-v-de2fd74e"]]), he = ["aria-label"], ge = ["href", "aria-label"], _e = { class: "navigation__end" }, ve = { class: "navigation__menu" }, ye = ["href", "onClick"], be = { class: "navigation__actions" }, xe = /*#__PURE__*/ k(/* @__PURE__ */ c({
	__name: "I9kNavigation",
	props: {
		links: {},
		brandHref: { default: "/" },
		brandLabel: { default: "Home" },
		compactAt: { default: 72 },
		expandAt: { default: 24 }
	},
	emits: ["navigate"],
	setup(n) {
		let r = n, o = g(!1), s = g(!1), c = t(() => r.brandHref), l = () => {
			let e = window.scrollY;
			o.value = e > 0, e > r.compactAt ? s.value = !0 : e < r.expandAt && (s.value = !1);
		};
		return p(() => {
			l(), window.addEventListener("scroll", l, { passive: !0 });
		}), m(() => window.removeEventListener("scroll", l)), (t, r) => (h(), i("header", { class: d(["navigation", { "is-scrolled": o.value }]) }, [a("nav", {
			class: "navigation__inner",
			"aria-label": n.brandLabel
		}, [a("a", {
			class: "navigation__brand",
			href: c.value,
			"aria-label": n.brandLabel
		}, [v(t.$slots, "brand", { compact: s.value }, void 0, !0)], 8, ge), a("div", _e, [a("ul", ve, [(h(!0), i(e, null, _(n.links, (e) => (h(), i("li", { key: e.id }, [a("a", {
			class: "navigation__link",
			href: e.href,
			onClick: (n) => t.$emit("navigate", e, n)
		}, b(e.label), 9, ye)]))), 128))]), a("div", be, [v(t.$slots, "actions", {}, void 0, !0)])])], 8, he)], 2));
	}
}), [["__scopeId", "data-v-f0a2293c"]]), Se = ["aria-label", "aria-pressed"], Ce = /*#__PURE__*/ k(/* @__PURE__ */ c({
	__name: "I9kThemeSwitcher",
	props: {
		modelValue: {
			type: Boolean,
			default: !1
		},
		lightLabel: { default: "Switch to light mode" },
		darkLabel: { default: "Switch to dark mode" }
	},
	emits: ["update:modelValue"],
	setup(e, { emit: n }) {
		let r = e, a = n, s = t(() => r.modelValue ? r.lightLabel : r.darkLabel);
		return (t, n) => (h(), i("button", {
			class: d(["theme-switcher", { "is-dark": e.modelValue }]),
			type: "button",
			"aria-label": s.value,
			"aria-pressed": e.modelValue,
			onClick: n[0] ||= (t) => a("update:modelValue", !e.modelValue)
		}, [...n[1] ||= [o("<span class=\"theme-switcher__thumb\" aria-hidden=\"true\" data-v-ba979414><svg class=\"theme-switcher__icon theme-switcher__icon--sun\" viewBox=\"0 0 20 20\" data-v-ba979414><circle cx=\"10\" cy=\"10\" r=\"3.25\" data-v-ba979414></circle><path d=\"M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6L16 16M16 4l-1.4 1.4M5.4 14.6L4 16\" data-v-ba979414></path></svg><svg class=\"theme-switcher__icon theme-switcher__icon--moon\" viewBox=\"0 0 20 20\" data-v-ba979414><path d=\"M16.8 12.5A7 7 0 0 1 7.5 3.2a7 7 0 1 0 9.3 9.3Z\" data-v-ba979414></path></svg></span>", 1)]], 10, Se));
	}
}), [["__scopeId", "data-v-ba979414"]]), we = /* @__PURE__ */ c({
	__name: "I9kButton",
	props: {
		to: { default: null },
		href: { default: null },
		variant: { default: "default" },
		active: {
			type: Boolean,
			default: !1
		},
		type: { default: "button" },
		linkComponent: { default: null }
	},
	setup(e) {
		let r = e, i = S(), a = t(() => r.to !== null || r.href !== null), o = t(() => r.to ?? r.href ?? void 0), s = t(() => r.linkComponent ?? (a.value ? "a" : "button"));
		return (t, r) => (h(), n(y(s.value), u(x(i), {
			to: e.linkComponent && e.to !== null ? e.to : void 0,
			href: !e.linkComponent && a.value ? o.value : void 0,
			type: a.value ? void 0 : e.type,
			class: [
				"btn",
				`btn--${e.variant}`,
				{ "is-active": e.active }
			]
		}), {
			default: w(() => [v(t.$slots, "default")]),
			_: 3
		}, 16, [
			"to",
			"href",
			"type",
			"class"
		]));
	}
}), Te = ["href"], Ee = {
	key: 0,
	class: "badge badge--solid link-card-badge"
}, De = {
	key: 1,
	class: "link-card-image"
}, Oe = ["src", "alt"], ke = { class: "link-card-body" }, Ae = { class: "link-card-name" }, je = { class: "link-card-description" }, Me = {
	key: 2,
	class: "link-card-arrow",
	"aria-hidden": "true"
}, Ne = /*#__PURE__*/ k(/* @__PURE__ */ c({
	__name: "I9kLinkCard",
	props: {
		name: {},
		url: {},
		description: {},
		image: { default: null },
		badge: { default: null },
		showImage: {
			type: Boolean,
			default: !0
		},
		arrow: {
			type: Boolean,
			default: !1
		},
		arrowLabel: { default: "↗" }
	},
	emits: ["click"],
	setup(e) {
		return (t, n) => (h(), i("a", {
			class: "surface surface--interactive link-card",
			href: e.url,
			target: "_blank",
			rel: "noopener",
			onClick: n[0] ||= (e) => t.$emit("click", e)
		}, [
			e.badge ? (h(), i("span", Ee, b(e.badge), 1)) : r("", !0),
			e.showImage && e.image ? (h(), i("div", De, [a("img", {
				src: e.image,
				alt: e.name,
				width: "60",
				height: "60",
				loading: "lazy"
			}, null, 8, Oe)])) : r("", !0),
			a("div", ke, [a("h3", Ae, b(e.name), 1), a("p", je, b(e.description), 1)]),
			e.arrow ? (h(), i("span", Me, b(e.arrowLabel), 1)) : r("", !0)
		], 8, Te));
	}
}), [["__scopeId", "data-v-c8fa5346"]]), Pe = { class: "page-header__body" }, $ = {
	key: 0,
	class: "eyebrow"
}, Fe = {
	key: 1,
	class: "lede"
}, Ie = {
	key: 0,
	class: "page-header__avatar"
}, Le = /*#__PURE__*/ k(/* @__PURE__ */ c({
	__name: "I9kPageHeader",
	props: {
		kicker: { default: null },
		title: {},
		description: { default: null },
		id: { default: null },
		level: { default: 1 }
	},
	setup(e) {
		return (t, o) => (h(), i("header", { class: d(["page-header", { "page-header--with-avatar": t.$slots.avatar }]) }, [a("div", Pe, [
			e.kicker ? (h(), i("p", $, b(e.kicker), 1)) : r("", !0),
			(h(), n(y(`h${e.level}`), {
				id: e.id ?? void 0,
				class: "main-title page-header-title"
			}, {
				default: w(() => [s(b(e.title), 1)]),
				_: 1
			}, 8, ["id"])),
			v(t.$slots, "subtitle", {}, void 0, !0),
			e.description ? (h(), i("p", Fe, b(e.description), 1)) : r("", !0),
			v(t.$slots, "actions", {}, void 0, !0)
		]), t.$slots.avatar ? (h(), i("div", Ie, [v(t.$slots, "avatar", {}, void 0, !0)])) : r("", !0)], 2));
	}
}), [["__scopeId", "data-v-c5e57521"]]), Re = {
	key: 0,
	class: "eyebrow eyebrow--number"
}, ze = { class: "section-heading-body" }, Be = {
	key: 0,
	class: "section-heading-description"
}, Ve = /*#__PURE__*/ k(/* @__PURE__ */ c({
	__name: "I9kSectionHeading",
	props: {
		number: { default: null },
		title: {},
		description: { default: null },
		id: { default: null },
		level: { default: 2 }
	},
	setup(e) {
		return (t, o) => (h(), i("div", { class: d(["section-heading", { "section-heading--has-number": e.number }]) }, [e.number ? (h(), i("p", Re, b(e.number), 1)) : r("", !0), a("div", ze, [(h(), n(y(`h${e.level}`), {
			id: e.id ?? void 0,
			class: "title"
		}, {
			default: w(() => [s(b(e.title), 1)]),
			_: 1
		}, 8, ["id"])), e.description ? (h(), i("p", Be, b(e.description), 1)) : r("", !0)])], 2));
	}
}), [["__scopeId", "data-v-8386cbc9"]]), He = { class: "timeline" }, Ue = { class: "timeline__time" }, We = { class: "timeline__main" }, Ge = /* @__PURE__ */ c({
	__name: "I9kTimelineCard",
	props: {
		date: {},
		linked: {
			type: Boolean,
			default: !1
		},
		locale: { default: "en" }
	},
	setup(e) {
		let n = e, r = t(() => new Intl.DateTimeFormat(n.locale, {
			year: "numeric",
			month: "long",
			day: "numeric",
			timeZone: "UTC"
		}).format(n.date instanceof Date ? n.date : /* @__PURE__ */ new Date(`${n.date}T00:00:00Z`)));
		return (t, n) => (h(), i("div", He, [
			a("p", Ue, b(r.value), 1),
			n[0] ||= a("div", { class: "timeline__rail" }, null, -1),
			a("div", { class: d(["timeline__card", { "timeline__card--linked": e.linked }]) }, [a("div", We, [v(t.$slots, "default")]), v(t.$slots, "thumbnail")], 2)
		]));
	}
});
//#endregion
export { A as I9kArticleHeader, M as I9kAsciiEmoji, ee as I9kBlurredCircles, U as I9kBrandWordmark, we as I9kButton, q as I9kFaqList, fe as I9kFooter, Z as I9kIcon, me as I9kLanguageSwitcher, Ne as I9kLinkCard, xe as I9kNavigation, Le as I9kPageHeader, Ve as I9kSectionHeading, Q as I9kSocialLinks, Ce as I9kThemeSwitcher, Ge as I9kTimelineCard };
