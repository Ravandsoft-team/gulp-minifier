jQuery(document).ready(function ($) {

    if ((Cookies.get("tour-activate") == undefined) || (Cookies.get("tour-activate") == 'on')) {
        bgdarktour = '<div class="position-fixed start-0 end-0 bottom-0 top-0 sf-bg-loader sf-bg-tour" style="z-index:1;"></div>';
        $('body').append(bgdarktour);
        tourelem = '.question-answer';
        tourcontent = '<div class="px-2">لطفا برای تجربه بهتر راهنما را مطالعه فرمائید</div>'+
            '<button button class="sf-btn sf-btn-outline-primary later-tour"> بعدا</button >'+
            '<button button class="sf-btn sf-btn-primary close-tour"> باشه</button >';
        var el =
            '<div class="top bg-body text-dark sf-the-tour" style="visibility:visible;opacity:1;">'+
                '<i></i>'+
                '<span>'+tourcontent+'</span>'+
            '</div>';
        $(tourelem).append(el);
        $(tourelem).find('.top').css('visibility','visible').animate({
            opacity: 1,
        }, 300);
    }
    
    $('.later-tour').click(function (e) { 
        e.preventDefault();
        $('.sf-the-tour').remove();
        $('.sf-bg-tour').remove();
        Cookies.set('tour-activate', 'on' , { expires: 365 });
    });
    $('.close-tour').click(function (e) { 
        e.preventDefault();
        $('.sf-the-tour').remove();
        $('.sf-bg-tour').remove();
        Cookies.set('tour-activate', 'off' , { expires: 365 });
    });

    $('.order-price>span').each(function () {
        $(this).text(numberWithCommas($(this).text()));
    })
    
    $('.sf-form-control').focus(function () {
        sf_focus_input(this);
    });
    $('.sf-form-control').blur(function () {
        $(this).removeClass('err-msg-input');
        if (this.value == "")
            $(this).parent().find('label').animate({
                'top': '15',
                'right': '25',
                'color': '#a0a0a0',
            });
    });

    $('#sf-email-buyer').keyup(function (e) {
        var email = $(this).val();
        if (!isEmail(email)) {
            $(this).parent().find('.err-msg-input').removeClass('d-none');
            $(this).addClass('err-input');
        } else {
            $(this).parent().find('.err-msg-input').addClass('d-none');
            $(this).removeClass('err-input');
            $(this).addClass('succ-input');
        }
    });

    // check if input is fill ,  add green border
    // $('.sf-form-control').on('input change' , function () {
    //     if($(this).val().length > 0){
    //         $(this).addClass('succ-input');
    //     }
    // });

    // for using keyboard 
    $('.sf-form-control').keypress(function (e) {
        if (e.which === 13) { // enter key
            // Focus next textfield

            if (e.shiftKey) {
                $('.sf-form-control').val('');
                $('.sf-form-control').parent().find('label').animate({
                    'top': '15',
                    'right': '25',
                    'color': '#a0a0a0'
                });
            } else {
                $(this).parent().next().find('input').focus();
            }
        }
    });

    $('.sf-form-control').keydown(function (e) {
        if ((e.which == 8 || e.which == 46) && this.value == "") {
            $(this).parent().prev().find('input').focus();
        }
    });

    $('#sf-email-buyer').keydown(function (e) {
        if (e.which === 13) {
            $('.next-step-op1').trigger('click');
            $('#sf-barcode-product').trigger('focus');
        }
    });
    $('#sf-num-product').keydown(function (e) {
        if (e.which === 13) {
            $('.total_price .sf-price').text('0');
            $('.btn-get-table').trigger('click');
        }
    });

    var counter = 0;
    $('#sf-barcode-product , #sf-name-product').keydown(function (e) {
        // console.log($('.sf-products').length);
        var totalItem = $('.sf-products').length -1;
        if (e.which === 40) { // down key
            if (counter >= 0 && counter < totalItem){
                ++counter;
            }
            $('.sf-products').removeClass('focus-ajax-item');
            var theclass = '.child-'+counter;
            // console.log(theclass);
            $(theclass).addClass('focus-ajax-item');
        }else if (e.which === 38){ // up key
            if (counter > 0 && counter <= totalItem) {
                --counter;
            }
            // console.log(counter);
            $('.sf-products').removeClass('focus-ajax-item');
            var theclass = '.child-'+counter;
            // console.log(theclass);
            $(theclass).addClass('focus-ajax-item');
        }else if(e.which === 13){
            if($('.sf-products').hasClass('focus-ajax-item')){
                $('.focus-ajax-item').trigger('click');
            }
        }
    });
    // for using keyboard


    // for steps 
    $('.oprations-orders').on('click' ,'.next-step-op1' , function (e) {
        e.preventDefault();
        $('.sf-prog1').removeClass('active-progress').addClass('done-progress');
        $('.sf-prog2').addClass('active-progress');
        // setTimeout(function () {
        $('.next-step-op1').addClass('next-step-op2').removeClass('next-step-op1');
        // }, 1000);
        $('.prev-step-op1').removeClass('d-none').css('color' , '#757575');
        $('.sec-1-buyer').removeClass('sf-active-sec');
        op_animate('.sec-1-buyer', 0);
        $('.sec-2-buyer').addClass('sf-active-sec');
        op_animate('.sec-2-buyer', 1);

        $('.progress-bar-for-mobile').attr('style', 'width:40% !important;');
        
        $('.about-customer').addClass('d-none');
        $('.order_informations').removeClass('d-none');
    });
    $('.oprations-orders').on( 'click', '.prev-step-op1',function (e) {
        e.preventDefault();
        $('.sf-prog1').removeClass('done-progress').addClass('active-progress');
        $('.sf-prog2').removeClass('active-progress');
    
        $('.next-step-op2').addClass('next-step-op1').removeClass('next-step-op2');

        $('.prev-step-op1').addClass('d-none').css('color' , '#eee');
        $('.sec-2-buyer').removeClass('sf-active-sec');
        op_animate('.sec-2-buyer', 0);
        $('.sec-1-buyer').addClass('sf-active-sec');
        op_animate('.sec-1-buyer', 1);
        $('.progress-bar-for-mobile').attr('style', 'width:20% !important;');

        $('.about-customer').removeClass('d-none');
        $('.order_informations').addClass('d-none');
    });
    
    $('.oprations-orders').on( 'click' , '.next-step-op2' ,function (e) { 
        e.preventDefault();
        $('.sf-prog2').removeClass('active-progress').addClass('done-progress');
        $('.sf-prog3').addClass('active-progress');

        $('.next-step-op2').addClass('next-step-op3').removeClass('next-step-op2');
        $('.prev-step-op1').addClass('prev-step-op2').removeClass('prev-step-op1');
   
        $('.sec-2-buyer').removeClass('sf-active-sec');
        op_animate('.sec-2-buyer', 0);
        $('.sec-3-buyer').addClass('sf-active-sec');
        op_animate('.sec-3-buyer', 1);

        $('.progress-bar-for-mobile').attr('style', 'width:60% !important;');
    });
    $('.oprations-orders').on('click', '.prev-step-op2' ,function (e) {
        $('.sf-prog2').removeClass('done-progress').addClass('active-progress');
        $('.sf-prog3').removeClass('active-progress');

        $('.next-step-op3').addClass('next-step-op2').removeClass('next-step-op3');
        $('.prev-step-op2').addClass('prev-step-op1').removeClass('prev-step-op2');

        $('.sec-3-buyer').removeClass('sf-active-sec');
        op_animate('.sec-3-buyer', 0);
        $('.sec-2-buyer').addClass('sf-active-sec');
        op_animate('.sec-2-buyer', 1);

        $('.progress-bar-for-mobile').attr('style', 'width:40% !important;');
    });

    $('.oprations-orders').on( 'click' , '.next-step-op3' ,function (e) { 
        e.preventDefault();
        $('.sf-prog3').removeClass('active-progress').addClass('done-progress');
        $('.sf-prog4').addClass('active-progress');

        $('.next-step-op3').addClass('next-step-op4').removeClass('next-step-op3');
        $('.prev-step-op2').addClass('prev-step-op3').removeClass('prev-step-op2');

        $('.sec-3-buyer').removeClass('sf-active-sec');
        op_animate('.sec-3-buyer', 0);
        $('.sec-4-buyer').addClass('sf-active-sec');
        op_animate('.sec-4-buyer', 1);

        $('.progress-bar-for-mobile').attr('style', 'width:80% !important;');
    });
    $('.oprations-orders').on('click', '.prev-step-op3' ,function (e) {
        e.preventDefault();
        $('.sf-prog3').removeClass('done-progress').addClass('active-progress');
        $('.sf-prog4').removeClass('active-progress');

        $('.next-step-op4').addClass('next-step-op3').removeClass('next-step-op4');
        $('.prev-step-op3').addClass('prev-step-op2').removeClass('prev-step-op3');

        $('.sec-4-buyer').removeClass('sf-active-sec');
        op_animate('.sec-4-buyer', 0);
        $('.sec-3-buyer').addClass('sf-active-sec');
        op_animate('.sec-3-buyer', 1);

        $('.progress-bar-for-mobile').attr('style', 'width:60% !important;');
    });

    $('.oprations-orders').on( 'click' , '.next-step-op4' ,function (e) { 
        e.preventDefault();
        $('.sf-prog4').removeClass('active-progress').addClass('done-progress');
        $('.sf-prog5').addClass('active-progress');

        $('.next-step-op4').addClass('d-none').css('color', '#eee');
        $('.prev-step-op3').addClass('prev-step-op4').removeClass('prev-step-op3');

        $('.sec-4-buyer').removeClass('sf-active-sec');
        op_animate('.sec-4-buyer', 0);
        $('.sec-5-buyer').addClass('sf-active-sec');
        op_animate('.sec-5-buyer', 1);

        $('.progress-bar-for-mobile').attr('style', 'width:100% !important;');
    });
    $('.oprations-orders').on('click', '.prev-step-op4' ,function (e) {
        e.preventDefault();
        $('.sf-prog4').removeClass('done-progress').addClass('active-progress');
        $('.sf-prog5').removeClass('active-progress');

        $('.next-step-op4').removeClass('d-none').css('color', '#757575');
        $('.prev-step-op4').addClass('prev-step-op3').removeClass('prev-step-op4');

        $('.sec-5-buyer').removeClass('sf-active-sec');
        op_animate('.sec-5-buyer', 0);
        $('.sec-4-buyer').addClass('sf-active-sec');
        op_animate('.sec-4-buyer', 1);

        $('.progress-bar-for-mobile').attr('style', 'width:80% !important;');
    });
    // for steps 
    
    // for show enything in steps
    $('.oprations-orders').click(function () {
        // for show section two in add product section
        setInterval(function () {
            if ($('.sf-registered-orders tbody tr').length == 0) {
                $('.next-step-op2').prop('disabled' , true);
            } else {
                $('.next-step-op2').prop('disabled' , false);
            }
        }, 1000);

        
        if ($('.sf-prog2').hasClass('active-progress')){
            $('.line-row-2').removeClass('d-none');
            // for add class "sf_add_user" to next-step-op1 button
            $('.oprations-orders').children().removeClass('sf_add_user');
        } else {
            $('.line-row-2').addClass('d-none');
            $('.next-step-op1').prop('disabled' , false);
        }
        
      

        // for show invoice button 
        if ($('.sf-prog5').hasClass('active-progress')) {
            $('.btn-print-invoice').removeClass('d-none');
        }else {
            $('.btn-print-invoice').addClass('d-none');
 
        }

        // for show address in invoice
        if($('.sf-prog5').hasClass('active-progress')){
            
            var address = $('.address-choosen:checked').parent().find('.the-address').text();
            $('.customer-address').text(address);
            
            var totals_price = 0;
            if ($('body').hasClass('sf_mobile_show')) {
                $('.show-product-mobile').each(function () {
                    var id = $(this).find('.product-id-orders').val();
                    var name = $(this).find('.sf-name-in-orders').text();
                    var unit_price = $(this).find('.sf-unit-price-in-orders').text();
                    var num = $(this).find('.td-num').val();
                    var total_price = $(this).find('.sf-total-price-in-orders').text();
                    var barcode = $(this).find('.sf-barcode-in-orders').text();

                    if (!$('.sf-registered-invoice').hasClass(barcode)) {
                        var table =
                            '<table class="sf-table sf-registered-invoice shadow-sm bg-body rounded mb-3 '+barcode+'">' +
                            '<tr>' +
                            '<input type="hidden" class="product-id-invoice" value="'+ id +'">' +
                            '<th>بارکد : </td>' +
                            '<td class="sf-barcode-in-invoice">'+barcode+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<th>نام محصول : </th>' +
                            '<td class="sf-name-in-invoice">'+name+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<th>قیمت محصول : </th>' +
                            '<td class="sf-unit-price-in-invoice">'+unit_price+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<th>تعداد : </th>' +
                            '<td class="td-num">'+num+'</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<th>قیمت کل : </th>' +
                            '<td class="sf-total-price-in-invoice">'+total_price+'</td>' +
                            '</tr>';
                            '</table>';
                        $('.line-row-5 .total-products').after(table);
                    }
                });

                $('.sf-total-price-in-invoice').each(function () {
                    var prices = parseInt($(this).text().replace(/,/g, ''));
                    totals_price += parseInt(prices);
                });
                $('.line-row-5 .total-products>span').text($('.sf-registered-invoice').length);
            } else {
                $('.sf-registered-orders tbody tr').each(function () {
                    var row = $(this).find('.sf-row-in-orders').text();
                    var id = $(this).find('.product-id-orders').val();
                    var name = $(this).find('.sf-name-in-orders').text();
                    var unit_price = $(this).find('.sf-unit-price-in-orders').text();
                    var num = $(this).find('.td-num').val();
                    var total_price = $(this).find('.sf-total-price-in-orders').text();
                    var barcode = $(this).find('.sf-barcode-in-orders').text();

                    if (!$('.sf-registered-invoice tbody tr').hasClass(barcode)) {
                        var table = $('.sf-registered-invoice');
                        table.find('tbody').append('<tr class="' + barcode + '">' +
                            '<td class="sf-row-in-invoice"><input type="hidden" class="product-id-invoice" value="'+ id +'">' + row + '</td>' +
                            '<td class="sf-barcode-in-invoice">' + barcode + '</td>' +
                            '<td class="sf-name-in-invoice">' + name + '</td>' +
                            '<td class="sf-unit-price-in-invoice">' + unit_price + '</td>' +
                            '<td class="td-num">' + num + '</td>' +
                            '<td class="sf-total-price-in-invoice">' + total_price + '</td>' +
                            '</tr>');
                    }
                });

        
                $('.sf-registered-invoice tbody tr').each(function () {
                    var prices = parseInt($(this).find('.sf-total-price-in-invoice').text().replace(/,/g, ''));
                    totals_price += parseInt(prices);
                });
                $('.sf-registered-invoice .total-products>span').text($('.sf-registered-invoice tbody tr').length);
            }
            $('.sf-registered-invoice .total-price-invoice span').text(numberWithCommas(totals_price));

            $('.total-payprice-invoice>span').text(numberWithCommas(totals_price));
            var total_price = $('.total_payprice .sf-total-payprice');

            var coupon_amount = parseInt($('#discount-code option:selected').data('amount'));
            if (! total_price.hasClass('discounted') && coupon_amount != 0) {
                var total = parseInt(total_price.text().replace(/,/g, ''));
                total_price.attr('data-mainprice', total);
                total_price.text(numberWithCommas(total - coupon_amount));
                $('.total-payprice-invoice>span').text(numberWithCommas(total - coupon_amount));
                total_price.addClass('discounted');
                $('.coupon_price .sf-coupon-price').text(numberWithCommas(coupon_amount));
                $('.total-discount-invoice>span').text(numberWithCommas(coupon_amount));
            } else if (coupon_amount == 0) {
                total_price.removeClass('discounted');
                mainprice = total_price.data('mainprice');
                total_price.text(numberWithCommas(mainprice));
                $('.total-payprice-invoice>span').text(numberWithCommas(mainprice));
                $('.total-discount-invoice>span').text(0);
            }

            $('.line-row-5').removeClass('d-none');
        } else {
            $('.line-row-5').addClass('d-none');
        }

        if($('.sf-prog4').hasClass('active-progress')){
            // $('.total_payprice .sf-total-payprice').removeClass('discounted');
        }
    });

    // for add amount to preview discount 
    $('#discount-code').change(function () {
        var coupon_amount = parseInt($(this).find('option:selected').data('amount'));
        // console.log(coupon_amount);
        if (coupon_amount != 0) {
            $('.coupon_price .sf-coupon-price').text(numberWithCommas(coupon_amount));
        } else if((coupon_amount == 0) || (coupon_amount == null)) {
            $('.coupon_price .sf-coupon-price').text(0);
        }
    });

    $("#sf-mobile-buyer , #sf-num-product").inputFilter(function (value) {
        return /^-?\d*$/.test(value.toEnglishDigit());
    });


    // for mobile
    $('.empty-inputs').click(function (e) {
        e.preventDefault();
        $('.sf-form-control').val('');
        $('.sf-form-control').parent().find('label').animate({
            'top': '15',
            'right': '25',
            'color': '#a0a0a0'
        });
    });

    // Create our number formatter.
    var formatter = new Intl.NumberFormat();

    // when click on ajax items
    $('.show-results-ajax').on('click', '.sf-products', function () {
        var inp_barcode = $('#sf-barcode-product');
        var inp_name = $('#sf-name-product');
        var title = $(this).data('name');
        var price = $(this).data('price');
        var saleprice = $(this).data('saleprice');
        var sku = $(this).data('sku');
        var qty = (($(this).data('qty') == 'stock')?'stock': $(this).data('qty'));
        var id = $(this).data('id');
        sf_focus_input('#sf-name-product , #sf-barcode-product');
        if (title) {
            $('#sf-name-product').val(title);
            if (qty == 'stock') {
                $('#sf-num-product').attr('placeholder', 'این محصول موجود میباشد');
            } else {
                $('#sf-num-product').attr('placeholder', ' موجودی این محصول ' + qty);
            }
            
            $('#sf-num-product').attr('data-totalqty', qty);
        }
        if (sku) {
            inp_barcode.val(sku);
        }
        inp_barcode.parent().find('.show-results-ajax').removeClass('d-grid');
        inp_barcode.parent().find('.show-results-ajax').addClass('d-none');

        inp_barcode.removeClass('err-input').addClass('succ-input');
        inp_barcode.parent().find('.msg-input').addClass('d-none');
        inp_name.removeClass('err-input').addClass('succ-input');
        inp_name.parent().find('.msg-input').addClass('d-none');
        
        inp_name.parent().find('.show-results-ajax').removeClass('d-grid');
        inp_name.parent().find('.show-results-ajax').addClass('d-none');
        $('.sf-products').remove();
        $('.show-results-ajax').height('0');

        $('.unit_price .sf-price').text(price);
        if (saleprice != 0) {
            $('.sale_price').removeClass('d-none');
            $('.sale_price').addClass('d-flex');
        } else if(saleprice == 0) {
            $('.sale_price').addClass('d-none');
            $('.sale_price').removeClass('d-flex');
        }
        $('.sale_price .sf-price').text(saleprice);

        $('.price-for-table').val(price);
        $('.sale-price-for-table').val(saleprice);
        $('#sf-product-id-orders').val(id);
        $('.order_informations').removeClass('d-none');
    });

    // for calculate total price
    var num_product = $('#sf-num-product');
    num_product.on('input', function () {
        var num = parseInt($(this).val());
        var price = parseInt($('.unit_price .sf-price').text());
        if (num) {
            $('.total_price .sf-price').text(0);
            $('.total_price .sf-price').text(formatter.format(num * price));
        } else {
            $('.total_price .sf-price').text(0);
            $('.total_price .sf-price').text(formatter.format(price));
        }
        // console.log(parseInt($(this).attr('data-totalqty')));
        if (num > parseInt($(this).attr('data-totalqty'))) {
            num_product.addClass('err-input').removeClass('succ-input');
            num_product.parent().find('.msg-input')
                .removeClass('d-none')
                .addClass('err-msg-input')
                .text('تعداد وارد شده بیشتر از موجودی انبار میباشد');
        } else if(num <= parseInt($(this).attr('data-totalqty'))){
            num_product.addClass('succ-input').removeClass('err-input');
            num_product.parent().find('.msg-input')
                .addClass('d-none')
                .removeClass('err-msg-input')
                .text('');
        }
    });

    // for add product to table
    $('.btn-get-table').on('click', function () {
        var barcode = $('#sf-barcode-product').val();
        var price = $('.sale-price-for-table').val();
        if (price == 0) {
            price = $('.price-for-table').val();
        }
        var table = $('.sf-registered-orders');
        var qty = $('#sf-num-product').attr('data-totalqty');
        var id = $('#sf-product-id-orders').val();
        if(input_is_fill('#sf-barcode-product') && input_is_fill('#sf-name-product') && input_is_fill('#sf-num-product') && ! num_product.hasClass('err-input')){
            var name = $('#sf-name-product').val();
            var num = $('#sf-num-product').val();
            if ($('body').hasClass('sf_mobile_show')) {
                if (!$('.show-product-mobile').hasClass(barcode)) {
                    count = $('.show-product-mobile').length + 1;
                    $('.count-orders').text(count + ' مورد ');
                    var trow =
                        '<div class="shadow-sm bg-body mt-2 px-0 rounded position-relative show-product-mobile ' + barcode + '">' +
                        '<table class="sf-table sf-registered-orders mb-0">' +
                        '<input type="hidden" class="product-id-orders" value="' + id + '">' +
                        '<tbody>' +
                        '<tr>' +
                        '<th scope="col">بارکد</th>' +
                        '<td scope="col" class="sf-barcode-in-orders">' + barcode + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<th scope="col">نام محصول</th>' +
                        '<td scope="col" class="sf-name-in-orders">' + name + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<th scope="col">قیمت واحد</th>' +
                        '<td scope="col" class="sf-unit-price-in-orders">' + numberWithCommas(price) + '</td>' +
                        '</tr>' +
                        '<tr>' +
                        '<th scope="col">تعداد</th>' +
                        '<td scope="col"><input type="text" class="input-in-table td-num" value="' + num + '" data-qty="'+((qty == 'stock')?'موجود':qty)+'" disabled></td>' +
                        '</tr>' +
                        '<tr>' +
                        '<th scope="col">قیمت کل</th>' +
                        '<td scope="col" class="sf-total-price-in-orders">' + numberWithCommas((price * num)) + '</td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<span class="sf-btn sf-btn-primary float-end sf-edit-btn-table me-2 mb-2">ویرایش</span>' +
                        '<span class="sf-btn sf-btn-red float-end sf-del-btn-table" data-delid=".' + barcode + '">حذف</span>' +
                        '</div>';
                    $('.add-after-sec-mobile').after(trow);
                    afterCreateTable('.show-product-mobile');
                } else {
                    var alert = '<div class="alert alert-danger mt-3 sf-message-time" role="alert">این محصول قبلا ثبت شده است، در قسمت سفارش های ثبت شده میتوانید نسبت به تغییر آن اقدام نمایید</div>';
                    getAlertShow(alert);
                }
            } else {
                if (!$('.sf-table tbody tr').hasClass(barcode)) {
                    count = $('.sf-table tbody tr').length + 1;
                    table.parent().removeClass('d-none');
                    var button = '<span class="sf-btn-in-table sf-del-btn-table cursor-pointer" data-delid=".' + barcode + '"><span class="fas fa-trash-alt"></span></span>';
                    var button2 = '<span class="sf-btn-in-table sf-edit-btn-table cursor-pointer"><span class="fas fa-edit"></span></span>';
                    table.find('tbody').append('<tr class="'+barcode+'">' +
                        '<td><input class="p-0 input-in-table td-group-act" type="checkbox" data-act=".' + barcode + '" ></td>' +
                        '<td class="sf-row-in-orders"><input type="hidden" class="product-id-orders" value="' + id + '">' + count + '</td>' +
                        '<td class="sf-barcode-in-orders">' + barcode + '</td>' +
                        '<td class="sf-name-in-orders">' + name + '</td>' +
                        '<td class="sf-unit-price-in-orders">' + numberWithCommas(price) + '</td>' +
                        '<td><input class="p-0 input-in-table td-num" type="text" value="' + num + '" data-qty="'+((qty == 'stock')?'موجود':qty)+'" disabled></td>' +
                        '<td class="sf-total-price-in-orders">' + numberWithCommas((price*num)) + '</td>' +
                        '<td><div class="d-flex">' + button2 + button + '</div></td>' +
                        '</tr>');
                    afterCreateTable('.sf-table tbody tr');
                } else {
                    var alert = '<div class="alert alert-danger sf-message-time" role="alert">این محصول قبلا ثبت شده است، در قسمت سفارش های ثبت شده میتوانید نسبت به تغییر آن اقدام نمایید</div>';
                    getAlertShow(alert);
                }
            }
        }
    });
    // alert if product added before 
    function getAlertShow(alert) {
        $('.sec-2-buyer').append(alert);
        setTimeout(function() {
            $('.sf-message-time:last').remove();
        }, 5000);
    }

    // after added product and create table 
    function afterCreateTable(classRow) {
        $('#sf-barcode-product , #sf-name-product , #sf-num-product').val('');
        num_product.attr('placeholder', 'وارد کنید');
        $("#sf-name-product , #sf-num-product , #sf-barcode-product").removeClass('succ-input');
        $('.order_informations .total_price .sf-price').text('0');
        $('.order_informations .unit_price .sf-price').text('0');
        $('.order_informations .sale_price .sf-price').text('0');
        $("#sf-name-product , #sf-num-product").trigger("blur");
        $("#sf-barcode-product").trigger("focus");

        var totalpayprice = 0;
        $(classRow).each(function () {
            totalpayprice += parseInt($(this).find('.sf-total-price-in-orders').text().replace(/,/g, ''));
        });
        $('.total_payprice .sf-total-payprice').attr('data-mainprice' , totalpayprice);
        $('.total_payprice .sf-total-payprice').text(numberWithCommas(totalpayprice));
    }

    // for remove table
    $('body').on('click' , '.sf-del-btn-table' , function (e) {
        var delid = $(this).data('delid');
        $.confirm({
            title: 'اعلان',
            content: 'آیا از حذف این مورد مطمئن هستید ؟',
            buttons: {
                yes: {
                    text: 'بله',
                    btnClass: 'btn-green',
                    keys: ['enter'],
                    action: function(){
                        var delprice = parseInt($(delid).find('.sf-total-price-in-orders').text().replace(/,/g, ''));
                        var totalprice = parseInt($('.sf-total-payprice').text().replace(/,/g, ''));
                        $(delid).remove();
                        $('.sf-total-payprice').text(numberWithCommas(totalprice - delprice));
                        if(ids_arr){
                            for (i = 0; i < ids_arr.length; ++i) {
                                $(ids_arr[i]).remove();
                                $('.sf-group-all').prop('checked',false);
                            }
                            ids_arr = [];
                        }
                        if($('.sf-registered-orders tbody tr').length == 0){
                            $('.sf-registered-orders').parent().addClass('d-none');
                            $('.sf-total-payprice').text(0);
                        }
                    }
                },
                no: {
                    text: 'خیر',
                    btnClass: 'btn-red',
                    keys: ['esc'],
                    action: function(){}
                }
            }
        });
    });
    // for edit table
    $('.sf-table').on('click' , '.sf-edit-btn-table' , function () {
        $(this).parent().parent().parent().find('.td-num').attr('style', 'border:1px solid #e3e3e3 !important;').prop('disabled' , false);
        $(this).find('span').addClass('fa-check-circle');
        $(this).removeClass('sf-edit-btn-table').addClass('sf-ok-btn-table');
    });
    $('.sf-table').on('click' ,'.sf-ok-btn-table' , function () {
        if (! $(this).parent().parent().parent().find('.td-num').hasClass('err-input')) {
            $(this).parent().parent().parent().find('.td-num').removeAttr('style').prop('disabled' , true);
            $(this).find('span').removeClass('fa-check-circle');
            $(this).addClass('sf-edit-btn-table').removeClass('sf-ok-btn-table');
            var num = parseInt($(this).parent().parent().parent().find('.td-num').val());
            var price = parseInt($(this).parent().parent().parent().find('.sf-unit-price-in-orders').text().replace(/,/g, ''));
            $(this).parent().parent().parent().find('.sf-total-price-in-orders').text(numberWithCommas((num * price)));
            
            var totalpayprice = 0;
            $('.sf-table tbody tr').each(function () {
                totalpayprice += parseInt($(this).find('.sf-total-price-in-orders').text().replace(/,/g, ''));
            });
            $('.total_payprice .sf-total-payprice').text(numberWithCommas(totalpayprice));
        }
    });
    $('.sf-table').on('input' , '.td-num' , function () {
        var num = parseInt($(this).val());
        // console.log($(this).data('qty'));
        // console.log(num);
        if (num > $(this).data('qty')) {
            $(this).addClass('err-input').attr('style','border: 1px solid red!important;');
        }else{
            $(this).removeClass('err-input').attr('style','border: 1px solid #e3e3e3 !important;');
        }
    });

    // To edit the table as a group
    $('.sf-group-all').on('click', function () {
        $('.td-group-act').trigger('click');
    });

    var ids_arr = [];
    $('.sf-table').on('change' , '.td-group-act' , function () {
        var check = $(this).prop('checked');
        if(check === true){
            var button = '<span class="sf-del-btn-table">حذف سفارشات علامت زده</span>';
            $('.sf-del-group').text('');
            $('.sf-del-group').append(button);
            var data = $(this).data('act');
            ids_arr.push(data);
            // console.log(ids_arr);
        }else if (check === false){
            $('.sf-del-group').text('حذف');
            var data = $(this).data('act');
            sf_remove_from_arr(ids_arr, data);
            // console.log(ids_arr);
        }

    });

    
    // for menu options in order list 
    $('.btn-option-menu-orderlist').click(function (e) {
        e.preventDefault();
        // console.log($(".option-menu-orderlist").width());
        if ($('body').hasClass('sf_mobile_show')) {
            var toggleWidth = $(".option-menu-orderlist").width() == 280 ? "0" : "310px";
            var toggleleftoption = $(".option-menu-orderlist").width() == 280 ? "-30px" : "0";
        } else {
            var toggleWidth = $(".option-menu-orderlist").width() == 340 ? "0" : "370px";
            var toggleleftoption = $(".option-menu-orderlist").width() == 340 ? "-30px" : "0";
        }
        $('.option-menu-orderlist').animate({ 'left': toggleleftoption });
        $('.option-menu-orderlist').animate({ width: toggleWidth });
        

        var left = $('.btn-option-menu-orderlist').css('left');
        if ((left == '0px') || (left == '0')) {
            if ($('body').hasClass('sf_mobile_show')) {
                $('.btn-option-menu-orderlist').css('left' , '310px');
            } else {
                $('.btn-option-menu-orderlist').css('left' , '370px');
            }
        } else {
            $('.btn-option-menu-orderlist').css('left' , '0');
        }
    });

    // for change tabs in options 
    $('.sf-get-column-1').click(function () {
        $('.sf-column-1').removeClass('d-none');
        $('.sf-column-2').addClass('d-none');
        $('.active-tab-orders-list').removeClass('active-tab-orders-list');
        $(this).addClass('active-tab-orders-list');
        // window.history.replaceState("", "", prevurl + '&tab=sfcolumn1');
    });
    $('.sf-get-column-2').click(function () {
        $('.sf-column-2').removeClass('d-none');
        $('.sf-column-1').addClass('d-none');
        $('.active-tab-orders-list').removeClass('active-tab-orders-list');
        $(this).addClass('active-tab-orders-list');
    });

    // for steps in mobile 
    if ($('body').hasClass('sf_mobile_show')) {
        $('.div-progress-orders-mobile , .oprations-orders').on('click', function () {
            $('.sf-progress').addClass('d-none');
            $('.active-progress').removeClass('d-none');
        });
    }

    // for show tooltips
    $('.sf-tooltip').mouseover(function () { 
        addTooltip(this);
    });

    // checking peyment method 
    $('input[name="sf-payment-method"]').change(function (e) { 
        e.preventDefault();
        if ($(this).val() != 'cod') {
            $('.sf-peyment-section').removeClass('d-none');
        } else {
            $('.sf-peyment-section').addClass('d-none');
        }
    });

});

// for recieve mobile number 
(function ($) {
    $.fn.inputFilter = function (inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                // this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    };
}(jQuery));

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function op_animate(el, num) {
    $(el).animate({
        opacity: num,
    })
}

function sf_focus_input(classes) {
    $(classes).parent().find('label').animate({
        'top': '-10',
        'right': '15',
        'color': 'black',
    });
    $(this).removeClass('err-input');
}

function input_is_fill(theinput){
    if($(theinput).val().length > 0){
        return true;
    }else {
        $(theinput).addClass('err-input');
        return false;
    }
}

function sf_remove_from_arr(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;

    // var ary = ['three', 'seven', 'eleven'];
    // sf_remove_from_arr(ary, 'seven');
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function sfPrintFactor() {
    var frame = document.getElementById('sffactor');
    frame.contentWindow.focus();
    frame.contentWindow.print();
}

function addTooltip(elem) {
    content = $(elem).data('sftooltip');
    var el =
        '<div class="top">'+
            '<span>'+content+'</span>'+
            '<i></i>'+
        '</div>';
    $(elem).append(el);
    $(elem).find('.top').css('visibility','visible').animate({
        opacity: 1,
    } , 300);
    $(elem).mouseout(function () { 
        $(this).find('.top').remove();
    });
}
String.prototype.toEnglishDigit = function () {
    var find = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    var replace = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var replaceString = this;
    var regex;
    for (var i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g"); replaceString = replaceString.replace(regex, replace[i]);
    }
    return replaceString;
};
