jQuery(function($) {

    var handlers = [
        swiper,
        files,
        map,
        popups,
        menupos,
        menu,
        brands,
        menuhash,
        forms,
        utmsList,
        viewport,
        masking,
    ];

    $.each(handlers, function(i, handler){
        try {
            handler.call();
        } catch (e) {
            console.log('Error! ' + e.stack);
        }
    });


    function swiper() {
        var swiper = new Swiper('.swiper-container', {
            centeredSlides: true,
            slidesPerView: 'auto',
            speed: 1000,
            loop: true,
            loopedSlides: 3,
            autoHeight: false,
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 0,

                depth: 1480,
                modifier: 1,
                slideShadows: false
            },
            breakpoints: {
                480: {
                    loopedSlides: 3,
                    stretch: 0,
                    depth: 400
                }
            }
        });

        var swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.addEventListener('click', function(event) {
            if(event.target.className == 'swiper-button-prev') {
                swiper.slidePrev();
            }

            if(event.target.className == 'swiper-button-next') {
                swiper.slideNext();
            }
        });

    }

    function files() {
        $('.attach input[type=file]')
            .on('change', function() {
                var $parent = $(this).parent();

                for(var i = 0; i < this.files.length; i++) {
                    var file = this.files[i];
                    var $item = $('<div class="item-file"><div class="image"><img /></div><p></p><span class="remove"></span></div>');

                    $item.data('file', file);

                    $item.find('p').text(file.name);
                    var $img = $item.find('img');

                    var reader = new FileReader();
                    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })($img[0]);
                    reader.readAsDataURL(file);

                    $parent.append($item);
                }

            });

        $('.attach .label')
            .on('click', function(e) {
                e.preventDefault();

                $(this).siblings('input[type=file]').click();
            })

        $('.attach').on('click', '.remove', function() {
            $(this).closest('.item-file').remove();
        })
    }

    function map() {
        var $mapBlock = $('.map');
        if($mapBlock.length) {
            new Scheduler(function() {
                var map = new Maps(),
                    sch = this;

                map.show($mapBlock);

                map.setPin({
                    image: "/images/pin.svg",
                    size: { w: 87, h: 71 },
                    point: { x: 43, y: 71 },
                    position: { x: 0, y: 0 }
                });

                map.addPoint($('.map').data('coords'));
                map.setFocus($('.map').data('coords'));

                map.setZoom(15);

                this.run();
            });
        }
    }

    function popups() {
        $('.header__btn_call, .footer__btn_call').on('click', function(e) {
            e.preventDefault();

            $.fancybox.open({
                src: $('.popup__order-call'),
                type: 'inline',
                buttons: [
                    "close"
                ],
                toolbar: true,
                smallBtn: false
            });
        });

        $('.header__btn, .first-block .btn, .footer__btn')
            .on('click', function() {
                $('html,body').animate({
                    scrollTop: $('.estimate-block').offset().top - 70
                })
            });

        $('.info-block .close')
            .on('click', function(e) {
                e.preventDefault();

                $('.info-block').slideUp().removeClass('visible');
                $(window).trigger('closeinfo');
            })
    }

    function menu() {
        function preventer (e) {
            e.preventDefault();
        }

        $('.hamburger')
            .on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                $('.menu-block-mobile').toggleClass('open');
                $('.hamburger').toggleClass('is-active');
                $('body').toggleClass('noscroll');

                if($('.menu-block-mobile').hasClass('open')) {
                    $('header').css('top', 0);
                    $('body')[0].addEventListener("touchmove", preventer, { passive: false });
                } else {
                    $(window).trigger('scroll');
                    $('body')[0].removeEventListener("touchmove", preventer);
                }
            });

        $('.main-menu > li > a').on('click', function() {
            $('.hamburger').trigger('click');
        })
    }

    function menupos() {
        var $wnd = $(window),
            $header = $('header'),
            $first = $('.first-block');

        $header.css('position', 'absolute');

        var hheight = $header.height(),
            hmin = 0,
            htop = $header.offset().top;

        $header.css('position', '');

        $wnd.on('closeinfo', function() {
            htop = 0;
        });

        $wnd.on('ready load scroll', function() {
            if($wnd.scrollTop() < htop + (hheight - hmin) || window.matchMedia('(max-width: 480px)').matches) {
                if($header.hasClass('fixed')) {
                    $first.css({marginTop: 0});
                    $header.removeClass('fixed');
                }
            } else if($wnd.scrollTop() > htop) {
                $first.css({marginTop: hheight});
                $header.addClass('fixed');
                hmin = $header.height();
            }

            if(window.matchMedia('(max-width: 480px)').matches) {
                if ($wnd.scrollTop() > htop) {
                    $header.css({
                        'top': 0,
                        'position': 'fixed'
                    });
                } else {
                    $header.css({
                        'top': '',
                        'position': 'absolute'
                    });
                }
            } else {
                $header.css({
                    'top': '',
                    'position': ''
                });
            }

        })
    }

    function brands() {
        $('.brands-block .btn-more')
            .on('click', function(e) {
                e.preventDefault();

                $(this)
                    .toggleClass('open')
                    .siblings('.brands-list').slideToggle();
            })
    }


    function menuhash() {
        var $wnd = $(window),
            ss = [],
            $menus = $('header .menu-block li, .footer__main-menu li, .menu-block-mobile li'),
            preventHash = false,
            $header = $('header');

        $menus.find('a')
            .on('click', function(e) {
                var selector = $(this).attr('href').replace('#', '');

                var $s = $('[data-menu=' + selector + ']');
                if($s.length) {
                    e.preventDefault();

                    $('html,body')
                        .animate({
                            scrollTop: $s.offset().top - $header.height()
                        }, Math.abs($s.offset().top - $wnd.scrollTop()) * 0.3)
                }
            });


        $wnd
            .on('hashchange', function() {

                var $s = $('[data-menu=' + window.location.hash.replace('#', '') + ']');

                if($s.length) {
                    $wnd.scrollTop($s.offset().top - $header.height());
                    $wnd.on('load ready', function() {
                        $wnd.scrollTop($s.offset().top);
                    })
                }
            })

        if(window.location.hash) {
            $wnd.trigger('hashchange');
        }

        function findHeights() {
            ss = [];
            $('section')
                .each(function() {
                    var $s = $(this),
                        className = $s.data('menu');

                    ss.push({
                        obj: $s,
                        top: $s.offset().top,
                        bottom: $s.offset().top + $s.height(),
                        link: $('a[href="#' + className + '"]', $menus).parent()
                    });
                });
        }


        $wnd.on('load ready resize', function() {
            findHeights();
        })

        $wnd.on('scroll load', function() {
            var pos = $wnd.scrollTop(),
                found = false;

            for(var i in ss) {
                if(pos >= ss[i].top - $header.height() - 20 && pos < ss[i].bottom - $header.height() - 20) {
                    $menus.removeClass('active');
                    $('a[href="#' + ss[i].obj.data('menu') + '"]').parent().addClass('active');

                    if(ss[i].obj.data('menu')) {
                        history.replaceState({page: i}, false, document.location.pathname + document.location.search + '#' + ss[i].obj.data('menu'));
                    } else {
                        history.replaceState({page: i}, false, document.location.pathname + document.location.search);
                    }

                    found = true;
                    break;
                }
            }

            if(!found) {
                $menus.removeClass('active');
            }
        });
    }


    function forms() {
        function setMailHandler(formSelector, formLink) {
            $('body').on('submit', formSelector, function (e) {
                e.preventDefault();

                var $form = $(this);

                var $btn = $('button', $form);
                $btn.prop('disabled', true);

                var xhr = new XMLHttpRequest();
                var formData = new FormData($form.get(0));

                if(utms) {
                    formData.append('utms', JSON.stringify(utms));
                }

                $form.find('.item-file').each(function() {
                    formData.append('file[]', $(this).data('file'));
                })

                formData.append('page', document.location.pathname);

                xhr.addEventListener('load', function(e) {
                    if(xhr.status == 200) {
                        var res = $.parseJSON(xhr.responseText);

                        if(!res) return alert('Ошибка сервера');
                        switch (res.status) {
                            case 'wrong':
                                $.each(res.fields, function (id, val) {
                                    var $input = $form.find('[name=' + val + ']');
                                    $input.addClass('error');
                                });

                                $btn.prop('disabled', false);
                                break;

                            case 'error':
                                $btn.prop('disabled', false);
                                break;

                            default:
                                $form.addClass('success');

                        }

                        $form.find('.btn .progress').css('width', '0%');
                    }
                });

                xhr.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var progress = Math.ceil((evt.loaded / evt.total) * 100);
                        $form.find('.btn .progress').css('width', progress + '%');
                    }
                }, false);

                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var progress = Math.ceil((evt.loaded / evt.total) * 100);
                        $form.find('.btn .progress').css('width', progress + '%');
                    }
                }, false);

                $form.find('.btn .progress').css('width', '0%');

                xhr.open('POST', formLink, true);
                xhr.send(formData);

                return false;
            });
        }

        setMailHandler(
            'form',
            '/mail/index.php');
    }

    function decode(str) {
        try {
            return decodeURIComponent(str.replace(/\+/g, ' '));
        } catch (e) {
            return str;
        }
    }

    function parse (str){
        var pattern = /(\w+)\[(\d+)\]/;


        if ('string' != typeof str) return {};

        if ('' == str) return {};
        if ('?' == str.charAt(0)) str = str.slice(1);

        var obj = {};
        var pairs = str.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var parts = pairs[i].split('=');
            var key = decode(parts[0]);
            var m;

            if (m = pattern.exec(key)) {
                obj[m[1]] = obj[m[1]] || [];
                obj[m[1]][m[2]] = decode(parts[1]);
                continue;
            }

            obj[parts[0]] = null == parts[1]
                ? ''
                : decode(parts[1]);
        }

        return obj;
    }

    function utm(query) {
        var has = Object.prototype.hasOwnProperty;

        // Remove leading ? if present
        if (query.charAt(0) === '?') {
            query = query.substring(1);
        }

        query = query.replace(/\?/g, '&');

        var param;
        var params = parse(query);
        var results = {};

        for (var key in params) {
            if (has.call(params, key)) {
                if (key.substr(0, 4) === 'utm_') {
                    param = key;
                    results[param] = params[key];
                }
            }
        }

        return results;
    }

    function utmsList() {
        utms = utm(document.location.search);
    }

    function viewport() {
        $(window).on('ready load resize', function() {
            if(window.matchMedia('(min-device-width: 480px) and (max-device-width: 1160px)').matches) {
                document.querySelector('[name=viewport]').setAttribute('content', 'width=1160, maximum-scale=1, user-scalable=yes');
            } else {
                document.querySelector('[name=viewport]').setAttribute('content', 'width=device-width, initial-scale=1');
            }
        })
    }

    function masking() {
        $('input[name=phone]').inputmask('+7 (999) 999-99-99');

    }
});