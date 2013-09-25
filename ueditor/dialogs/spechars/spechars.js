
/**
 * Created with JetBrains PhpStorm.
 * User: xuheng
 * Date: 12-9-26
 * Time: 下午1:09
 * To change this template use File | Settings | File Templates.
 */
var charsContent = [
    { name:"tsfh", title:lang.tsfh, content:toArray("\u3001,\u3002,\u00b7,\u02c9,\u02c7,\u00a8,\u3003,\u3005,\u2014,\uff5e,\u2016,\u2026,\u2018,\u2019,\u201c,\u201d,\u3014,\u3015,\u3008,\u3009,\u300a,\u300b,\u300c,\u300d,\u300e,\u300f,\u3016,\u3017,\u3010,\u3011,\u00b1,\u00d7,\u00f7,\u2236,\u2227,\u2228,\u2211,\u220f,\u222a,\u2229,\u2208,\u2237,\u221a,\u22a5,\u2225,\u2220,\u2312,\u2299,\u222b,\u222e,\u2261,\u224c,\u2248,\u223d,\u221d,\u2260,\u226e,\u226f,\u2264,\u2265,\u221e,\u2235,\u2234,\u2642,\u2640,\u00b0,\u2032,\u2033,\u2103,\uff04,\u00a4,\uffe0,\uffe1,\u2030,\u00a7,\u2116,\u2606,\u2605,\u25cb,\u25cf,\u25ce,\u25c7,\u25c6,\u25a1,\u25a0,\u25b3,\u25b2,\u203b,\u2192,\u2190,\u2191,\u2193,\u3013,\u3021,\u3022,\u3023,\u3024,\u3025,\u3026,\u3027,\u3028,\u3029,\u32a3,\u338e,\u338f,\u339c,\u339d,\u339e,\u33a1,\u33c4,\u33ce,\u33d1,\u33d2,\u33d5,\ufe30,\uffe2,\uffe4,\u2121,\u02ca,\u02cb,\u02d9,\u2013,\u2015,\u2025,\u2035,\u2105,\u2109,\u2196,\u2197,\u2198,\u2199,\u2215,\u221f,\u2223,\u2252,\u2266,\u2267,\u22bf,\u2550,\u2551,\u2552,\u2553,\u2554,\u2555,\u2556,\u2557,\u2558,\u2559,\u255a,\u255b,\u255c,\u255d,\u255e,\u255f,\u2560,\u2561,\u2562,\u2563,\u2564,\u2565,\u2566,\u2567,\u2568,\u2569,\u256a,\u256b,\u256c,\u256d,\u256e,\u256f,\u2570,\u2571,\u2572,\u2573,\u2581,\u2582,\u2583,\u2584,\u2585,\u2586,\u2587,\ufffd,\u2588,\u2589,\u258a,\u258b,\u258c,\u258d,\u258e,\u258f,\u2593,\u2594,\u2595,\u25bc,\u25bd,\u25e2,\u25e3,\u25e4,\u25e5,\u2609,\u2295,\u3012,\u301d,\u301e")},
    { name:"lmsz", title:lang.lmsz, content:toArray("\u2170,\u2171,\u2172,\u2173,\u2174,\u2175,\u2176,\u2177,\u2178,\u2179,\u2160,\u2161,\u2162,\u2163,\u2164,\u2165,\u2166,\u2167,\u2168,\u2169,\u216a,\u216b")},
    { name:"szfh", title:lang.szfh, content:toArray("\u2488,\u2489,\u248a,\u248b,\u248c,\u248d,\u248e,\u248f,\u2490,\u2491,\u2492,\u2493,\u2494,\u2495,\u2496,\u2497,\u2498,\u2499,\u249a,\u249b,\u2474,\u2475,\u2476,\u2477,\u2478,\u2479,\u247a,\u247b,\u247c,\u247d,\u247e,\u247f,\u2480,\u2481,\u2482,\u2483,\u2484,\u2485,\u2486,\u2487,\u2460,\u2461,\u2462,\u2463,\u2464,\u2465,\u2466,\u2467,\u2468,\u2469,\u3220,\u3221,\u3222,\u3223,\u3224,\u3225,\u3226,\u3227,\u3228,\u3229")},
    { name:"rwfh", title:lang.rwfh, content:toArray("\u3041,\u3042,\u3043,\u3044,\u3045,\u3046,\u3047,\u3048,\u3049,\u304a,\u304b,\u304c,\u304d,\u304e,\u304f,\u3050,\u3051,\u3052,\u3053,\u3054,\u3055,\u3056,\u3057,\u3058,\u3059,\u305a,\u305b,\u305c,\u305d,\u305e,\u305f,\u3060,\u3061,\u3062,\u3063,\u3064,\u3065,\u3066,\u3067,\u3068,\u3069,\u306a,\u306b,\u306c,\u306d,\u306e,\u306f,\u3070,\u3071,\u3072,\u3073,\u3074,\u3075,\u3076,\u3077,\u3078,\u3079,\u307a,\u307b,\u307c,\u307d,\u307e,\u307f,\u3080,\u3081,\u3082,\u3083,\u3084,\u3085,\u3086,\u3087,\u3088,\u3089,\u308a,\u308b,\u308c,\u308d,\u308e,\u308f,\u3090,\u3091,\u3092,\u3093,\u30a1,\u30a2,\u30a3,\u30a4,\u30a5,\u30a6,\u30a7,\u30a8,\u30a9,\u30aa,\u30ab,\u30ac,\u30ad,\u30ae,\u30af,\u30b0,\u30b1,\u30b2,\u30b3,\u30b4,\u30b5,\u30b6,\u30b7,\u30b8,\u30b9,\u30ba,\u30bb,\u30bc,\u30bd,\u30be,\u30bf,\u30c0,\u30c1,\u30c2,\u30c3,\u30c4,\u30c5,\u30c6,\u30c7,\u30c8,\u30c9,\u30ca,\u30cb,\u30cc,\u30cd,\u30ce,\u30cf,\u30d0,\u30d1,\u30d2,\u30d3,\u30d4,\u30d5,\u30d6,\u30d7,\u30d8,\u30d9,\u30da,\u30db,\u30dc,\u30dd,\u30de,\u30df,\u30e0,\u30e1,\u30e2,\u30e3,\u30e4,\u30e5,\u30e6,\u30e7,\u30e8,\u30e9,\u30ea,\u30eb,\u30ec,\u30ed,\u30ee,\u30ef,\u30f0,\u30f1,\u30f2,\u30f3,\u30f4,\u30f5,\u30f6")},
    { name:"xlzm", title:lang.xlzm, content:toArray("\u0391,\u0392,\u0393,\u0394,\u0395,\u0396,\u0397,\u0398,\u0399,\u039a,\u039b,\u039c,\u039d,\u039e,\u039f,\u03a0,\u03a1,\u03a3,\u03a4,\u03a5,\u03a6,\u03a7,\u03a8,\u03a9,\u03b1,\u03b2,\u03b3,\u03b4,\u03b5,\u03b6,\u03b7,\u03b8,\u03b9,\u03ba,\u03bb,\u03bc,\u03bd,\u03be,\u03bf,\u03c0,\u03c1,\u03c3,\u03c4,\u03c5,\u03c6,\u03c7,\u03c8,\u03c9")},
    { name:"ewzm", title:lang.ewzm, content:toArray("\u0410,\u0411,\u0412,\u0413,\u0414,\u0415,\u0401,\u0416,\u0417,\u0418,\u0419,\u041a,\u041b,\u041c,\u041d,\u041e,\u041f,\u0420,\u0421,\u0422,\u0423,\u0424,\u0425,\u0426,\u0427,\u0428,\u0429,\u042a,\u042b,\u042c,\u042d,\u042e,\u042f,\u0430,\u0431,\u0432,\u0433,\u0434,\u0435,\u0451,\u0436,\u0437,\u0438,\u0439,\u043a,\u043b,\u043c,\u043d,\u043e,\u043f,\u0440,\u0441,\u0442,\u0443,\u0444,\u0445,\u0446,\u0447,\u0448,\u0449,\u044a,\u044b,\u044c,\u044d,\u044e,\u044f")},
    { name:"pyzm", title:lang.pyzm, content:toArray("\u0101,\u00e1,\u01ce,\u00e0,\u0113,\u00e9,\u011b,\u00e8,\u012b,\u00ed,\u01d0,\u00ec,\u014d,\u00f3,\u01d2,\u00f2,\u016b,\u00fa,\u01d4,\u00f9,\u01d6,\u01d8,\u01da,\u01dc,\u00fc")},
    { name:"yyyb", title:lang.yyyb, content:toArray("i:,i,e,æ,\u028C,\u0259:,\u0259,u:,u,\u0254:,\u0254,a:,ei,ai,\u0254i,\u0259u,au,i\u0259,\u03B5\u0259,u\u0259,p,t,k,b,d,g,f,s,\u0283,\u03B8,h,v,z,\u0292,ð,t\u0283,tr,ts,d\u0292,dr,dz,m,n,\u014B,l,r,w,j,")},
    { name:"zyzf", title:lang.zyzf, content:toArray("\u3105,\u3106,\u3107,\u3108,\u3109,\u310a,\u310b,\u310c,\u310d,\u310e,\u310f,\u3110,\u3111,\u3112,\u3113,\u3114,\u3115,\u3116,\u3117,\u3118,\u3119,\u311a,\u311b,\u311c,\u311d,\u311e,\u311f,\u3120,\u3121,\u3122,\u3123,\u3124,\u3125,\u3126,\u3127,\u3128")}
];
(function createTab(content) {
    for (var i = 0, ci; ci = content[i++];) {
        var span = document.createElement("span");
        span.setAttribute("tabSrc", ci.name);
        span.innerHTML = ci.title;
        if (i == 1)span.className = "focus";
        domUtils.on(span, "click", function () {
            var tmps = $G("tabHeads").children;
            for (var k = 0, sk; sk = tmps[k++];) {
                sk.className = "";
            }
            tmps = $G("tabBodys").children;
            for (var k = 0, sk; sk = tmps[k++];) {
                sk.style.display = "none";
            }
            this.className = "focus";
            $G(this.getAttribute("tabSrc")).style.display = "";
        });
        $G("tabHeads").appendChild(span);
        domUtils.insertAfter(span, document.createTextNode("\n"));
        var div = document.createElement("div");
        div.id = ci.name;
        div.style.display = (i == 1) ? "" : "none";
        var cons = ci.content;
        for (var j = 0, con; con = cons[j++];) {
            var charSpan = document.createElement("span");
            charSpan.innerHTML = con;
            domUtils.on(charSpan, "click", function () {
                editor.execCommand("insertHTML", this.innerHTML);
                dialog.close();
            });
            div.appendChild(charSpan);
        }
        $G("tabBodys").appendChild(div);
    }
})(charsContent);
function toArray(str) {
    return str.split(",");
}
