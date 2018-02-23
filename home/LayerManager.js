var sel1 = document.querySelector('#myListCountry');
var sel2 = document.querySelector('#myListCity');
var options2 = sel2.querySelectorAll('option');

function ChangeSelectList(selValue) {
    sel2.innerHTML = '';
    for(var i = 0; i < options2.length; i++) {
        if(options2[i].dataset.option === selValue) {
            sel2.appendChild(options2[i]);
        }
    }
}

ChangeSelectList(sel1.value);


$(function ChangeLayerList(){
    "use strict";
    $("#myListCity").change(function(){
        var period = this.value;
        alert("value: " + this.value);
            if (period === "Kodiak,AK") {
                $('.AK').show();
                $('.NY').hide();
                alert("if: " + period);
            } else if(period === "Middletown,NY"){
                $('.NY').show();
                $('.AK').hide();
                alert("else: " + period);
            } else{
                $('.NY').hide();
                $('.AK').hide();
                alert("else: " + period);
            }

    });
});