/**
 * 文库通用工具
 */

(function(){

    //标签属性白名单
    UE._wk_whitelist = {
//        a: {
//            href: true
//        },
        br: {
            type: true
        },
        div: {},
        h1: {},
        h2: {},
        h3: {},
        h4: {},
//        h5: {},
//        h6: {},
        img: {
            src: true,
            width: true,
            height: true,
            alt: true,
            __trans: {
                'c': 'src',
                'w': 'width',
                'h': 'height'
            }
        },
//        li: {},
//        ol: {
//            start: true,
//            type: true
//        },
//        ul: {
//            type: true
//        },
        p: {},
        span: {
            "data-remark": true
        }
//        table: {},
//        tr: {},
//        tbody: {},
//        thead: {},
//        tfoot: {},
//        th: {
//            rowspan: true,
//            colspan: true
//        },
//        td: {
//            rowspan: true,
//            colspan: true
//        },
//        sup: {},
//        sub: {}
    },
        UE.MERGE_FLAG = 'sectionmerge',
        UE.MERGE_FLAG = 'sectionmerge',
        UE.BLOCKQUOTE_FLAG = "ext_quote",
        UE.INSCRIBED_FLAG = "ext_inscribed",
        UE.LEGENDS_FLAG = "ext_legends",
        UE.INDENT_FLAG = "ext_text-indent",
        UE.NO_INDENT_FLAG = "ext_no_text-indent",
        UE.ALIGN_LEFT_FLAG = "ext_text-align_left",
        UE.ALIGN_RIGHT_FLAG = "ext_text-align_right",
        UE.ALIGN_CENTER_FLAG = "ext_text-align_center",
        UE.FLOAT_LEFT_FLAG = "ext_float_left",
        UE.FLOAT_RIGHT_FLAG = "ext_float_right",
        UE.PICNOTE_FLAG = "ext_picnote",
        UE.PICNOTE_TOP_FLAG = "ext_picnote_top",
        UE.PICNOTE_RIGHT_FLAG = "ext_picnote_right",
        UE.PICNOTE_BOTTOM_FLAG = "ext_picnote_bottom",
        UE.PICNOTE_LEFT_FLAG = "ext_picnote_left",
        UE.PICNOTE_VERTICAL_FLAG = "ext_vertical",
        UE.PICNOTE_TEXT_ALIGN_TOP_FLAG = "ext_text-align_top",
        UE.PICNOTE_TEXT_ALIGN_BOTTOM_FLAG = "ext_text-align_bottom",
        UE.BOLD_FLAG = "ext_bold",
        UE.FULLSCREENMARK_FLAG = "ext_screen_full",
        UE.ITALIC_FLAG = "ext_italic",
        UE.UNDERLINE_FLAG = "ext_underline",
        UE.FONT_FAMILY_YAHEI_FLAG = "ext_font-family_yahei",
        UE.FONT_FAMILY_SONGTI_FLAG = "ext_font-family_songti",
        UE.FONT_FAMILY_KAITI_FLAG = "ext_font-family_kaiti",
        UE.FONT_FAMILY_HEITI_FLAG = "ext_font-family_heiti",
        UE.FONT_SIZE_1_FLAG = "ext_font-size_1",
        UE.FONT_SIZE_2_FLAG = "ext_font-size_2",
        UE.FONT_SIZE_3_FLAG = "ext_font-size_3",
        UE.FONT_SIZE_4_FLAG = "ext_font-size_4",
        UE.FONT_SIZE_5_FLAG = "ext_font-size_5",
        UE.FONT_SIZE_6_FLAG = "ext_font-size_6",
        //className白名单
        UE._wk_classNameList = {};

    var COLORS = ('ffffff,000000,eeece1,1f497d,4f81bd,c0504d,9bbb59,8064a2,4bacc6,f79646,' +
                    'f2f2f2,7f7f7f,ddd9c3,c6d9f0,dbe5f1,f2dcdb,ebf1dd,e5e0ec,dbeef3,fdeada,' +
                    'd8d8d8,595959,c4bd97,8db3e2,b8cce4,e5b9b7,d7e3bc,ccc1d9,b7dde8,fbd5b5,' +
                    'bfbfbf,3f3f3f,938953,548dd4,95b3d7,d99694,c3d69b,b2a2c7,92cddc,fac08f,' +
                    'a5a5a5,262626,494429,17365d,366092,953734,76923c,5f497a,31859b,e36c09,' +
                    '7f7f7f,0c0c0c,1d1b10,0f243e,244061,632423,4f6128,3f3151,205867,974806,' +
                    'c00000,ff0000,ffc000,ffff00,92d050,00b050,00b0f0,0070c0,002060,7030a0').split(',');
    utils.each(COLORS, function(color){
        UE['COLOR_' + color.toUpperCase() + '_FLAG'] = "ext_color_" + color;
        UE['BGCOLOR_' + color.toUpperCase() + '_FLAG'] = "ext_bg-color_" + color;
    });

    UE._wk_classNameList[ UE.ALIGN_LEFT_FLAG ] = true;
    UE._wk_classNameList[ UE.ALIGN_RIGHT_FLAG ] = true;
    UE._wk_classNameList[ UE.ALIGN_CENTER_FLAG ] = true;
    UE._wk_classNameList[ UE.FLOAT_LEFT_FLAG ] = true;
    UE._wk_classNameList[ UE.FLOAT_RIGHT_FLAG ] = true;
    UE._wk_classNameList[ UE.PICNOTE_FLAG ] = true;
    UE._wk_classNameList[ UE.PICNOTE_TOP_FLAG ] = true;
    UE._wk_classNameList[ UE.PICNOTE_RIGHT_FLAG ] = true;
    UE._wk_classNameList[ UE.PICNOTE_BOTTOM_FLAG ] = true;
    UE._wk_classNameList[ UE.PICNOTE_LEFT_FLAG ] = true;
    UE._wk_classNameList[ UE.PICNOTE_VERTICAL_FLAG ] = true;
    UE._wk_classNameList[ UE.PICNOTE_TEXT_ALIGN_TOP_FLAG ] = true;
    UE._wk_classNameList[ UE.PICNOTE_TEXT_ALIGN_BOTTOM_FLAG ] = true;
    UE._wk_classNameList[ UE.MERGE_FLAG ] = true;
    UE._wk_classNameList[ UE.BLOCKQUOTE_FLAG ] = true;
    UE._wk_classNameList[ UE.INSCRIBED_FLAG ] = true;
    UE._wk_classNameList[ UE.LEGENDS_FLAG ] = true;
    UE._wk_classNameList[ UE.INDENT_FLAG ] = true;
    UE._wk_classNameList[ UE.NO_INDENT_FLAG ] = true;
    UE._wk_classNameList[ UE.BOLD_FLAG ] = true;
    UE._wk_classNameList[ UE.FULLSCREENMARK_FLAG ] = true;
    UE._wk_classNameList[ UE.ITALIC_FLAG ] = true;
    UE._wk_classNameList[ UE.UNDERLINE_FLAG ] = true;
    UE._wk_classNameList[ UE.FONT_FAMILY_YAHEI_FLAG ] = true;
    UE._wk_classNameList[ UE.FONT_FAMILY_SONGTI_FLAG ] = true;
    UE._wk_classNameList[ UE.FONT_FAMILY_KAITI_FLAG ] = true;
    UE._wk_classNameList[ UE.FONT_FAMILY_HEITI_FLAG ] = true;
    UE._wk_classNameList[ UE.FONT_SIZE_1_FLAG ] = true;
    UE._wk_classNameList[ UE.FONT_SIZE_2_FLAG ] = true;
    UE._wk_classNameList[ UE.FONT_SIZE_3_FLAG ] = true;
    UE._wk_classNameList[ UE.FONT_SIZE_4_FLAG ] = true;
    UE._wk_classNameList[ UE.FONT_SIZE_5_FLAG ] = true;
    UE._wk_classNameList[ UE.FONT_SIZE_6_FLAG ] = true;
    utils.each(COLORS, function(color){
        UE._wk_classNameList[ "ext_color_" + color ] = true;
        UE._wk_classNameList[ "ext_bg-color_" + color ] = true;
    });

    //互斥的类型
    UE.singleType = {
        quote: UE.BLOCKQUOTE_FLAG,
        inscribed: UE.INSCRIBED_FLAG,
        legends: UE.LEGENDS_FLAG
    };

    UE.singleIndent = {
        indent: UE.INDENT_FLAG,
        noindent: UE.NO_INDENT_FLAG
    };

    UE.singleAlign = {
        left: UE.ALIGN_LEFT_FLAG,
        right: UE.ALIGN_RIGHT_FLAG,
        center: UE.ALIGN_CENTER_FLAG
    };

    UE.singleImageFloat = {
        left: UE.FLOAT_LEFT_FLAG,
        right: UE.FLOAT_RIGHT_FLAG
    };

    UE.singlePicNotePos = {
        top: UE.PICNOTE_TOP_FLAG,
        right: UE.PICNOTE_RIGHT_FLAG,
        bottom: UE.PICNOTE_BOTTOM_FLAG,
        left: UE.PICNOTE_LEFT_FLAG
    };

    UE.singlePicNoteDir = {
        vertical: UE.PICNOTE_VERTICAL_FLAG,
        top: UE.PICNOTE_TEXT_ALIGN_TOP_FLAG,
        bottom: UE.PICNOTE_TEXT_ALIGN_BOTTOM_FLAG
    };

    UE.singleColor = {};
    UE.singleBgColor = {};
    utils.each(COLORS, function(color){
        UE.singleColor[color] = "ext_color_" + color;
        UE.singleBgColor[color] = "ext_bg-color_" + color;
    });

    UE.singleFontFamily = {
        'yahei': UE.FONT_FAMILY_YAHEI_FLAG,
        'songti': UE.FONT_FAMILY_SONGTI_FLAG,
        'kaiti': UE.FONT_FAMILY_KAITI_FLAG,
        'heiti': UE.FONT_FAMILY_HEITI_FLAG
    };

    UE.singleFontSize = {
        '1': UE.FONT_SIZE_1_FLAG,
        '2': UE.FONT_SIZE_2_FLAG,
        '3': UE.FONT_SIZE_3_FLAG,
        '4': UE.FONT_SIZE_4_FLAG,
        '5': UE.FONT_SIZE_5_FLAG,
        '6': UE.FONT_SIZE_6_FLAG
    };

    /**
     * 根据文库允许的className对节点的class进行过滤
     */
    UE._wk_filterClassName = function( node ) {

        var classNames = [];

        if( !node.hasAttr('class') ) {
            return;
        }

        node.getClasses().forEach(function( item ){

            if( UE._wk_classNameList[ item ] === true ) {
                classNames.push( item );
            }

        });

        node.setAttr('class');
        classNames.length && node.setAttr('class', classNames.join(" "));

    }

})();