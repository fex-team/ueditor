(function(){

    var _dialogObj = editor.ui._dialogs.insertimagetypeDialog,
        trImgAlt = null,
        TYPE_MAP = {
            0: 'float',
            1: 'cover',
            2: 'note'
        };

    window.onload = function(){

        var types = document.forms['imag-type']['type'],
            imageFloats = document.forms['imag-type']['imagefloat'],
            imageFloatText = document.forms['imag-type']['imagefloattext'],
            imageAltText = document.forms['imag-type']['title'],
            legendPositions = document.forms['imag-type']['legendPosition'],
            legendDirections = document.forms['imag-type']['legendDirection'],
            legendText = document.forms['imag-type']['legendtext'],
            altInput = document.forms['imag-type']['title'],
            imageInfo = getImageInfo();

        if( !_dialogObj.__img ) {
            return;
        }

        if(imageInfo) {
            switch(imageInfo.type){
                case 'imagefloat':
                    setRadioValue(types, 0);
                    setRadioValue(imageFloats, imageInfo.imagefloat);
                    imageFloatText.value = imageInfo.text;
                    legendText.value = imageInfo.text;
                    break;
                case 'imagecover':
                    setRadioValue(types, 1);
                    imageAltText.value = imageInfo.text;
                    break;
                case 'imagenote':
                    setRadioValue(types, 2);
                    setRadioValue(legendPositions, imageInfo.legendPosition);
                    setRadioValue(legendDirections, imageInfo.legendDirection);
                    legendText.value = imageInfo.text;
                    imageFloatText.value = imageInfo.text;
                    break;
                default:
                    break;
            }
        }

        var trImgFloText = document.getElementById("imagefloattext"),
            trImgAlt = document.getElementById("imgAlt"),
            trImgFlo = document.getElementById("imagefloat"),
            trLegPos = document.getElementById("legendPos"),
            trLegDir = document.getElementById("legendDir"),
            trLegText = document.getElementById("legendtext");

        //清理错误信息
        altInput.onfocus = clearError;

        changeHandler();
        types[0].addEventListener("change", changeHandler);
        types[1].addEventListener("change", changeHandler);
        types[2].addEventListener("change", changeHandler);

        dialog.onok = function () {

            var type = getRadioValue(types),
                legendPosition = getRadioValue(legendPositions),
                legendDirecton = getRadioValue(legendDirections);

            if( type == '2'){
                _dialogObj.__img[0].legendPosition = legendPosition;
                _dialogObj.__img[0].legendDirection = legendDirecton;
                _dialogObj.__img[0].legendText = legendText.value;
            }else if( type == '1' ) {
                _dialogObj.__img[0].alt = document.forms['imag-type']['title'].value;
                //如果插入的图片是封面， 则必须有alt属性
                if( !_dialogObj.__img[0].alt ) {
                    altInput.blur();
                    showError();
                    return false;
                }
            }else if(getRadioValue(imageFloats)) {
                _dialogObj.__img[0].imageFloat = getRadioValue(imageFloats);
                _dialogObj.__img[0].imageFloatText = imageFloatText.value;
            }


            editor.fireEvent('beforeInsertImage', _dialogObj.__img);
            editor.execCommand("insertImage", _dialogObj.__img, TYPE_MAP[type] || null);

            _dialogObj.__img = null;

        };

        dialog.oncancel = function(){
            _dialogObj.__img = null;
        };


        function changeHandler( ) {
            var value = getRadioValue(types);

            if( value === '1' ) {
                trImgFloText.style.display = 'none';
                trImgFlo.style.display = 'none';
                trImgAlt.style.display = '';
                trLegPos.style.display = 'none';
                trLegDir.style.display = 'none';
                trLegText.style.display = 'none';
            } else if( value === '2') {
                trImgFloText.style.display = 'none';
                trImgFlo.style.display = 'none';
                trImgAlt.style.display = 'none';
                trLegPos.style.display = '';
                trLegDir.style.display = '';
                trLegText.style.display = '';
            } else {
                trImgFloText.style.display = '';
                trImgFlo.style.display = '';
                trImgAlt.style.display = 'none';
                trLegPos.style.display = 'none';
                trLegDir.style.display = 'none';
                trLegText.style.display = 'none';
            }

        }

    };

    function getImageInfo(){
        var data = {},
            range = editor.selection.getRange(),
            img = range.getClosedNode(),
            parentNode = domUtils.findParentByTagName( editor.selection.getStart(), ['p', 'h2'], true);
        if(img && img.tagName=='IMG' && parentNode){
            data.text = utils.trim( parentNode.innerText || parentNode.textContent || '' );
            data.type = domUtils.hasClass(parentNode, UE.PICNOTE_FLAG) || '';
            for(var key in UE.singleImageFloat) {
                if( domUtils.hasClass(parentNode, UE.singleImageFloat[key]) ) {
                    data.type = 'imagefloat';
                    data.imagefloat = key;
                    break;
                }
            }
            if( img.alt  ) {
                data.type = 'imagecover';
                data.alt = img.alt;
            }
            if( domUtils.hasClass(parentNode, UE.PICNOTE_FLAG) ) {
                data.type = 'imagenote';
                var spanNode = parentNode.children[0].tagName=='SPAN' ? parentNode.children[0]:parentNode.children[1];
                if(spanNode.tagName=='SPAN'){
                    for(var key in UE.singlePicNotePos) {
                        if( domUtils.hasClass(spanNode, UE.singlePicNotePos[key]) ) {
                            data.legendPosition = key;
                            break;
                        }
                    }
                    for(var key in UE.singlePicNoteDir) {
                        if( domUtils.hasClass(spanNode, UE.singlePicNoteDir[key]) ) {
                            data.legendDirection = key;
                            break;
                        }
                    }
                }
            }
            return data;
        }
        return null;
    }

    function getRadioValue(arr){
        for( var i in arr ) {
            if( arr[i].checked ) {
                return arr[i].value;
                break;
            }
        }
        return null;
    }

    function setRadioValue(arr, key){
        if(key===undefined || key===null) return;
        for(var i = 0; i<arr.length; i++){
            arr[i].removeAttribute('checked');
            arr[arr[i].value] = arr[i];
        }
        arr[key].setAttribute('checked', 'checked');
    }

    function clearError() {
        document.getElementById("fieldError").innerHTML = '';
    }

    function showError() {
        document.getElementById("fieldError").innerHTML = '请输入标题文字';
    }


})();