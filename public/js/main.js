(function ($) {
  $(document).ready(function () {
    $("#tab-menu a").click(function (e) {
      e.preventDefault();
      $(this).tab("show");
    });
  });

  var $btn = $("#btntoTop");
  $(window).on("scroll", function () {
    var scroll = $(window).scrollTop();
    if (scroll < 80) {
      $btn.hide();
    } else {
      $btn.show();
      $btn.click(function () {
        $(window).scrollTop(0);
      });
    }
  });

  //info selengkapnya
  $("#txt-selengkapnya").click(function () {
    $(".layout-info-lengkap").toggle();
    // $(".txt-info-selengkapnya").toggle();
    if ($(this).text() == "Sembunyikan Info") {
      $(this).html("Info Selengkapnya<i class='fa fa-caret-down ml-2'></i>");
    } else {
      $(this).html("Sembunyikan Info<i class='fa fa-caret-up ml-2'></i>");
    }
  });

  //click gambar
  $("#thumbs img").click(function () {
    $("#img-main").attr("src", $(this).attr("src"));
    $(".popup-imgset-covid19").removeClass("active");
    $(this).addClass("active");
    // $('#description').html($(this).attr('alt'));
  });

  try {
    var selectSimple = $(".js-select-simple");

    selectSimple.each(function () {
      var that = $(this);
      var selectBox = that.find("select");
      var selectDropdown = that.find(".select-dropdown");
      selectBox.select2({
        dropdownParent: selectDropdown,
      });
    });
  } catch (err) {
    console.log(err);
  }

  $("html, body").hide();

  if (window.location.hash) {
    setTimeout(function () {
      $("html, body").scrollTop(0).show();
      $("html, body").animate(
        {
          scrollTop: $(window.location.hash).offset().top - 100,
        },
        1000
      );
    }, 0);
  } else {
    $("html, body").show();
  }
})(jQuery);

window.onscroll = function () {
  myFunction();
};
var layout = document.getElementById("layout-slider-menu");
var navbar = document.getElementById("section-slider-menu");
var sticky = layout.offsetTop;
function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky");
    navbar.classList.remove("d-none");
  } else {
    navbar.classList.remove("sticky");
    navbar.classList.add("d-none");
  }
}
