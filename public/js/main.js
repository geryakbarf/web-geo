(function ($) {

    $(document).ready(function () {
        $("#tab-menu a").click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });
    });
    
    var $btn = $('#btntoTop');
    $(window).on('scroll', function () {
        var scroll = $(window).scrollTop();
        if (scroll < 80) {
            $btn.hide();
        } else {
            $btn.show();
            $btn.click(function(){
                $(window).scrollTop(0);
            });
        }
    });


    //info selengkapnya
    $('#txt-selengkapnya').click(function(){
        $(".layout-info-lengkap").toggle();
        $(".txt-info-selengkapnya").toggle();
        if($(this).text() == 'Sembunyikan Info'){
            $(this).text('Info Selengkapnya');
        } else {
            $(this).text('Sembunyikan Info');
        }
    });

    //click gambar
    $('#thumbs img').click(function(){
        $('#img-main').attr('src',$(this).attr('src'));
        $('.popup-imgset-covid19').removeClass("active");
        $(this).addClass("active");
        // $('#description').html($(this).attr('alt'));
    });

    try {
        var selectSimple = $('.js-select-simple');
    
        selectSimple.each(function () {
            var that = $(this);
            var selectBox = that.find('select');
            var selectDropdown = that.find('.select-dropdown');
            selectBox.select2({
                dropdownParent: selectDropdown
            });
        });
    
    } catch (err) {
        console.log(err);
    }
})(jQuery);