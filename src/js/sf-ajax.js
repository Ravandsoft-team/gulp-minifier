// get user if exists 
jQuery(document).ready(function ($) {

    // define classes for responsive 
    var dgrid = ($('body').hasClass('sf_mobile_show')) ? "d-grid" : "";
    var ms = ($('body').hasClass('sf_mobile_show')) ? "" : "ms-4";

    $('#sf-mobile-buyer').on('input', function (e) {
        if ($(this).val().length == 11) {
            $(this).parent().append('<span class="sf-spinner-1 position-absolute"></span>');
            var number = $(this).val();
            $.ajax({
                type: 'POST',
                url: myAjax.ajaxurl,
                data: {
                    number: number,
                    'action': 'sf_check_if_user_exists'
                },
                success: function (data) {
                    // console.log(JSON.parse(data).status);
                    var check_data = JSON.parse(data).status;
                    if (check_data == 'false') {
                        $('#sf-mobile-buyer').parent().find('.sf-spinner-1').remove();
                        
                        $('#sf-mobile-buyer').removeClass('info-input').addClass('succ-input');
                        $('#sf-mobile-buyer').parent().find('.msg-input')
                            .removeClass('d-none')
                            .removeClass('info-msg-input')
                            .addClass('succ-msg-input')
                            .text('تلفن همراه قابل ثبت است');
                        // $('.user_informations').addClass('d-none');
                        if ($('.sf_add_user').length == 0) {
                            $('.next-step-op1').addClass('sf_add_user');
                        }
                        $('#sf-name-buyer').val('');
                        $('#sf-lastname-buyer').val('');
                        $('#sf-email-buyer').val('');
                    } else if (check_data == 'true') {
                        $('#sf-mobile-buyer').parent().find('.sf-spinner-1').remove();

                        $('#sf-mobile-buyer').removeClass('succ-input').addClass('info-input');
                        $('#sf-mobile-buyer').parent().find('.msg-input')
                            .removeClass('d-none')
                            .removeClass('succ-msg-input')
                            .addClass('info-msg-input')
                            .text('تلفن همراه وارد شده قبلا ثبت شده است');
                        
                        var getdata = JSON.parse(data);
                        $('.customer-id').val(getdata.id);
                        $('#sf-name-buyer').val(getdata.name);
                        $('#sf-lastname-buyer').val(getdata.last_name);
                        $('#sf-email-buyer').val(getdata.email);
                        $('.user_informations .last_name span').text(getdata.last_name);
                        $('.about-customer .last_orders span').text(getdata.last_orders);
                        $('.about-customer .last_orders_price span').text(getdata.last_orders_price);
                        $('.level_customer span').text(getdata.level_customer);
                        $('.sf-form-control').parent().find('label').animate({
                            'top': '-10',
                            'right': '15',
                            'color': 'black'
                        });

                        $('.customer-last-name').text(getdata.last_name);
                        $('.customer-phone-num').text(number);

                        var dt = new Date();
                        var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
                        // var date = dt.getFullYear() + "/" + dt.getMonth() + "/" + dt.getDate();
                        let today = new Date().toLocaleDateString('fa-IR');

                        $('.customer-date-order').text(today);
                        $('.customer-time-order').text(time);
                        // $('.user_informations').removeClass('d-none');
                    }
                },
                error: function (data) {
                    console.log(data);
                    return 'false';
                }
            });
        }
    });


    // for add user to website 
    $('.oprations-orders').on('click', '.sf_add_user', function (e) {
        e.preventDefault();
        $(this).parent().find('.sf-spinner-1').removeClass('d-none');
        var the_number = $('#sf-mobile-buyer').val();
        var the_name = $('#sf-name-buyer').val();
        var the_lastname = $('#sf-lastname-buyer').val();
        var the_email = $('#sf-email-buyer').val();
        if (the_number.length > 1 && the_name.length > 1 && the_lastname.length > 1) {
            createnewuser(the_number, the_name, the_lastname, the_email);
            $('.user_informations .last_name>span').text(the_lastname);
        } else {
            if (the_number.length == 0) {
                $('#sf-mobile-buyer').addClass('err-input');
            }
            if (the_name.length == 0) {
                $('#sf-name-buyer').addClass('err-input');
            }
            if (the_lastname.length == 0) {
                $('#sf-lastname-buyer').addClass('err-input');
            }

            $(this).parent().find('.sf-spinner-1').addClass('d-none');
        }
    });


    // for create user 
    function createnewuser(number, name, lastname, email) {
        jQuery.ajax({
            type: 'POST',
            url: myAjax.ajaxurl,
            data: {
                number: number,
                name: name,
                lastname: lastname,
                email: email,
                'action': 'sf_create_new_user'
            },
            success: function (data) {
                // console.log(data);
                if (data != 'exists') {
                    $('.sf_add_user').parent().find('.sf-spinner-1').addClass('d-none');
                    $('.customer-id').val(data);
                }
            }
        });
    }

    // get sku of product
    var inp_barcode = $('#sf-barcode-product');
    inp_barcode.on('input', function () {
        if ($(this).val().length > 1) {
            if ($('.sf-spinner-1').length == 0) {
                $(this).parent().append('<span class="sf-spinner-1 position-absolute"></span>');
            }
            var sku = $(this).val();
            $.ajax({
                type: 'POST',
                url: myAjax.ajaxurl,
                data: {
                    sku: sku,
                    'action': 'sf_get_product_by_sku'
                },
                success: function (data) {

                    var mydata = JSON.parse(data);
                    console.log(mydata);
                    if (mydata.length != 0) {
                        $('.show-results-ajax').removeClass('d-grid');
                        $('.show-results-ajax').addClass('d-none');
                        $('.sf-products').remove();
                        $('.show-results-ajax').height('0');
                        for (var i = 0; i < mydata.length; i++) {
                            var el = "<span class='"+dgrid+" sf-products child-" + [i] + "' id='sf-product-id-" + mydata[i].id + "' data-id='" + mydata[i].id + "' data-price='" + mydata[i].price + "' data-sku='" + mydata[i].sku + "' data-name='" + mydata[i].title + "' data-qty='"+mydata[i].quantity+"' data-saleprice='"+((mydata[i].saleprice == null)?0:mydata[i].saleprice)+"' > " + mydata[i].sku +" - "+ mydata[i].title + " <span class='"+ms+"'>قیمت : " + mydata[i].price + "</span><span class='"+ms+" sf-quantity'>موجودی : "+((mydata[i].quantity == 'stock')?'موجود':mydata[i].quantity) +"</span></span>";
                            inp_barcode.parent().find('.show-results-ajax').removeClass('d-none');
                            inp_barcode.parent().find('.show-results-ajax').addClass('d-grid');
                            var test = "#sf-product-id-" + mydata[i].id;
                            if ($('body').hasClass('sf_mobile_show')) {
                                var height = 85 * mydata.length;
                            } else {
                                var height = 45 * mydata.length;
                            }
                            if($(test).length == 0){
                                $('.show-results-ajax').animate({
                                    height: height+'px',
                                });
                                inp_barcode.parent().find('.show-results-ajax').append(el);
                            }
                        }
                    } else {
                        inp_barcode.addClass('err-input').removeClass('succ-input');
                        inp_barcode.parent().find('.msg-input')
                            .removeClass('d-none')
                            .addClass('err-msg-input')
                            .text('بارکد وارد شده معتبر نمی باشد');
                    }
                    $('.sf-spinner-1').remove();
                },
            });
        }
    });

    // get name of product
    var inp_name = $('#sf-name-product');
    inp_name.on('input', function () {
        if ($(this).val().length > 1) {
            if ($('.sf-spinner-1').length == 0) {
                $(this).parent().append('<span class="sf-spinner-1 position-absolute"></span>');
            }
            var pname = $(this).val();
            $.ajax({
                type: 'POST',
                url: myAjax.ajaxurl,
                data: {
                    pname: pname,
                    'action': 'sf_get_product_by_name'
                },
                success: function (data) {

                    var mydata = JSON.parse(data);
                    console.log(mydata);
                    if (mydata.length != 0) {
                        $('.show-results-ajax').removeClass('d-grid');
                        $('.show-results-ajax').addClass('d-none');
                        $('.sf-products').remove();
                        $('.show-results-ajax').height('0');
                        for (var i = 0; i < mydata.length; i++) {
                            var el = "<span class='"+dgrid+" sf-products child-" + [i] + "' id='sf-product-id-" + mydata[i].id + "' data-id='" + mydata[i].id + "' data-price='" + mydata[i].price + "' data-sku='" + mydata[i].sku + "' data-name='" + mydata[i].title + "' data-qty='" + mydata[i].quantity + "' data-saleprice='"+((mydata[i].saleprice == null)?0:mydata[i].saleprice)+"' > " + mydata[i].sku + " - " + mydata[i].title + " <span class='"+ms+"'>قیمت : " + mydata[i].price + "</span><span class='"+ms+" sf-quantity'>موجودی : "+((mydata[i].quantity == 'stock')?'موجود':mydata[i].quantity) +"</span></span>";
                            inp_name.parent().find('.show-results-ajax').removeClass('d-none');
                            inp_name.parent().find('.show-results-ajax').addClass('d-grid');
                            var test = "#sf-product-id-" + mydata[i].id;
                            if ($('body').hasClass('sf_mobile_show')) {
                                var height = 85 * mydata.length;
                            } else {
                                var height = 45 * mydata.length;
                            }
                            if ($(test).length == 0) {
                                $('.show-results-ajax').animate({
                                    height: height + 'px',
                                });
                                inp_name.parent().find('.show-results-ajax').append(el);
                            }
                        }
                    } else {
                        inp_name.addClass('err-input').removeClass('succ-input');
                        inp_name.parent().find('.msg-input')
                            .removeClass('d-none')
                            .addClass('err-msg-input')
                            .text('نام محصول وارد شده معتبر نمی باشد');
                    }
                    
                    $('.sf-spinner-1').remove();
                },
            });
        }

    });


    // for add new address
    $('.btn-get-new-address').click(function (e) { 
        e.preventDefault();
        $(this).hide();
        customer_id = $('.customer-id').val();
        state = $("#sf-state option:selected").text();
        stateVal = $("#sf-state option:selected").val();
        city = $('#city option:selected').text();
        address = $('#sf-address').val();
        postcode = $('#sf-postcode').val();

        if ($('.sf-spinner-1').length == 0) {
            $(this).parent().append('<span class="sf-spinner-1"></span>');
        }
        $.ajax({
            type: 'POST',
            url: myAjax.ajaxurl,
            data: {
                customer_id: customer_id,
                state: state,
                stateVal: stateVal,
                city: city,
                address: address,
                postcode: postcode,
                'action': 'sf_set_billing_address_customer'
            },
            success: function (data) {
                var mydata = (JSON.parse(data)).val;
                var address = "<input type='radio' class='address-choosen' name='address-choosen'><span id='"+(JSON.parse(data)).key+"' class='the-address'>" +
                    " استان <span class='sf-registered-state' data-state='"+ ((mydata.stateVal == undefined) ? 'undefined' : mydata.stateVal) +"'>" + ((mydata.state == undefined) ? 'ناموجود' : mydata.state) + "</span>" +
                    " ، شهر  <span class='sf-registered-city'>" + ((mydata.city == undefined) ? 'ناموجود' : mydata.city) + "</span>" +
                    " , <span class='sf-registered-address'>" + ((mydata.address == undefined) ? 'ناموجود' : mydata.address) + "</span>" +
                    " - کد پستی <span class='sf-registered-postcode'>" + ((mydata.postcode == undefined) ? 'ناموجود' : mydata.postcode)+ "</span>" +
                    "<i class='fas fa-trash mx-2 cursor-pointer delete-address-inline'></i></span>";

                $('.sf-send-way-sec>span').append("<div class='mb-2'>" + address + "</div>");
                $('.sf-send-way-sec').removeClass('d-none');
                $('.sf-spinner-1').remove();
                $('.btn-get-new-address').show();

            },
        });
    });

    // for show enything in steps
    $('.oprations-orders').click(function () {
        // for get user address 
        if ($('.sf-prog3').hasClass('active-progress')) {
            get_user_address();
        }
    });

    // for get user address 
    function get_user_address(){
        customer_id = $('.customer-id').val();
        $.ajax({
            type: 'POST',
            url: myAjax.ajaxurl,
            data: {
                customer_id: customer_id,
                'action': 'sf_get_billing_address_customer'
            },
            success: function (data) {
                var mydata = JSON.parse(data);
                $('.address-choosen').parent().remove();
                for (var i = 0; i < mydata.length; i++){
                    var address = '';

                    var address = "<input type='radio' class='address-choosen' name='address-choosen'><span id='"+mydata[i].meta_key+"' class='the-address'>" +
                        " استان <span class='sf-registered-state' data-state='"+ ((mydata[i].meta_value.stateVal == undefined) ? 'undefined' : mydata[i].meta_value.stateVal) +"'>" + ((mydata[i].meta_value.state == undefined) ? 'ناموجود' : mydata[i].meta_value.state) + "</span>" +
                        " ، شهر  <span class='sf-registered-city'>" + ((mydata[i].meta_value.city == undefined) ? 'ناموجود' : mydata[i].meta_value.city) + "</span>" +
                        " , <span class='sf-registered-address'>" + ((mydata[i].meta_value.address == undefined) ? 'ناموجود' : mydata[i].meta_value.address) + "</span>" +
                        " - کد پستی <span class='sf-registered-postcode'>" + ((mydata[i].meta_value.postcode == undefined) ? 'ناموجود' : mydata[i].meta_value.postcode)+ "</span>" +
                        "<i class='fas fa-trash mx-2 cursor-pointer delete-address-inline'></i></span>";

                    $('.sf-send-way-sec>span').append("<div class='mb-2'>" + address + "</div>");
                }
                $('.sf-send-way-sec').removeClass('d-none');
            },
        });
    }

    // for remove address by key 
    $('.sf-send-way-sec').on('click','.delete-address-inline',function (e) { 
        e.preventDefault();
        var customer_id = $('.customer-id').val();
        var address_key = $(this).parent().attr('id');
        $.confirm({
            title: 'اعلان',
            content: 'آیا از حذف این مورد مطمئن هستید ؟',
            buttons: {
                yes: {
                    text: 'بله',
                    btnClass: 'btn-green',
                    keys: ['enter'],
                    action: function () {
                        $('#' + address_key).parent().remove();
                        $.ajax({
                            type: 'POST',
                            url: myAjax.ajaxurl,
                            data: {
                                customer_id: customer_id,
                                address_key: address_key,
                                'action': 'sf_delete_billing_address_customer'
                            },
                            success: function (data) {
                                // console.log(data);
                            },
                        });
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

    function getProductInvoiceTable(theclass) {
        var idqty = Array();
        $(theclass).each(function () {
            var id = $(this).find('.product-id-invoice').val();
            var barcode = $(this).find('.sf-barcode-in-invoice').text();
            var productname = $(this).find('.sf-name-in-invoice').text();
            var qty = $(this).find('.td-num').text();
            var totalprice = $(this).find('.sf-total-price-in-invoice').text().replace(/,/g, '');
            idqty.push(id +'~'+ barcode +'~'+ productname +'~'+ qty +'~'+ totalprice);
        });
        return idqty;
    }
    // for add new order 
    $('.btn-print-invoice').click(function () {
        $(this).text('لطفا صبر کنید ...');
        var first_name = $('#sf-name-buyer').val();
        var last_name = $('#sf-lastname-buyer').val();
        var email = $('#sf-email-buyer').val();
        if (email.length == 0) {
            email = 'ravand.vc@gmail.com';
        }
        var phone = $('#sf-mobile-buyer').val();

        var address = $('.the-address .sf-registered-address').text();
        var city = $('.the-address .sf-registered-city').text();
        var state = $('.the-address .sf-registered-state').attr('data-state');
        var stateTXT = $('.the-address .sf-registered-state').text();
        var postcode = $('.the-address .sf-registered-postcode').text();
        var payment_method = $('input[name="sf-payment-method"]:checked').val();
        var coupon_title = $('#discount-code').val();
        var order_note = $('#invoice-description').val();


        if ($('body').hasClass('sf_mobile_show')) {
            var productInfo = getProductInvoiceTable('.sf-registered-invoice');
        } else {
            var productInfo = getProductInvoiceTable('.sf-registered-invoice tbody tr');
        }
        var customer_id = $('.customer-id').val();

        $.ajax({
            type: 'POST',
            url: myAjax.ajaxurl,
            data: {
                customer_id: customer_id,
                idqty: productInfo,
                first_name: first_name,
                last_name: last_name,
                phone: phone,
                address: address,
                city: city,
                state: state,
                stateTXT: stateTXT,
                postcode: postcode,
                payment_method: payment_method,
                coupon_title: coupon_title,
                order_note: order_note,
                'action': 'sf_create_vip_order'
            },
            success: function (data) {
                var mydata = JSON.parse(data);
                // console.log(mydata);
                if ((mydata.status == 'pending') || (mydata.status == 'processing')) {
                    $('.btn-print-invoice').text('ثبت سفارش').prop('disabled' , true);
                    $.alert({
                        theme:'modern',
                        title: 'سفارش ثبت شد',
                        content: 'شماره پیگیری : '+ mydata.trackCode,
                        type: 'green',
                        typeAnimated: true,
                        buttons: {
                            ok: {
                                text: 'باشه',
                                btnClass: ['sf-btn', 'sf-btn-outline-primary'],
                                keys: ['shift', 'esc'],
                                action: function(){
                                    location.reload();
                                }
                            },
                            print: {
                                text: 'چاپ فاکتور',
                                btnClass: ['sf-btn', 'sf-btn-primary'],
                                keys: ['enter'],
                                action: function () {
                                    window.open(mydata.linkfile, "DescriptiveWindowName" , "resizable,scrollbars");
                                }
                            }
                        }
                    });
                }
            },
        });
    });

    $('.submit-roles-access').click(function (e) {
        e.preventDefault();
        $(this).text('لطفا صبر کنید ...');
        sf_date_roles = ['sf-date-roles'];
        $('.sf-date-roles input:checked').each(function () {
            sf_date_roles.push($(this).data('role'));
        });
        
        sf_tracking_roles = ['sf-tracking-roles'];
        $('.sf-tracking-roles input:checked').each(function () {
            sf_tracking_roles.push($(this).data('role'));
        });

        sf_phone_roles = ['sf-phone-roles'];
        $('.sf-phone-roles input:checked').each(function () {
            sf_phone_roles.push($(this).data('role'));
        });

        sf_totalproducts_roles = ['sf-totalproducts-roles'];
        $('.sf-totalproducts-roles input:checked').each(function () {
            sf_totalproducts_roles.push($(this).data('role'));
        });

        sf_pricepaid_roles = ['sf-pricepaid-roles'];
        $('.sf-pricepaid-roles input:checked').each(function () {
            sf_pricepaid_roles.push($(this).data('role'));
        });

        sf_statuspaid_roles = ['sf-statuspaid-roles'];
        $('.sf-statuspaid-roles input:checked').each(function () {
            sf_statuspaid_roles.push($(this).data('role'));
        });
        
        sf_deliverydate_roles = ['sf-deliverydate-roles'];
        $('.sf-deliverydate-roles input:checked').each(function () {
            sf_deliverydate_roles.push($(this).data('role'));
        });

        sf_poststatus_roles = ['sf-poststatus-roles'];
        $('.sf-poststatus-roles input:checked').each(function () {
            sf_poststatus_roles.push($(this).data('role'));
        });
        
        $.ajax({
            type: 'POST',
            url: myAjax.ajaxurl,
            data: {
                sf_date_roles: sf_date_roles,
                sf_tracking_roles: sf_tracking_roles,
                sf_phone_roles: sf_phone_roles,
                sf_totalproducts_roles: sf_totalproducts_roles,
                sf_pricepaid_roles: sf_pricepaid_roles,
                sf_statuspaid_roles: sf_statuspaid_roles,
                sf_deliverydate_roles: sf_deliverydate_roles,
                sf_poststatus_roles: sf_poststatus_roles,
                'action': 'sf_saveUserRoleAccess'
            },
            success: function (data) {
                // var mydata = JSON.parse(data);
                // console.log(mydata);
                location.reload();
            },
        });
    });

    $('.save-role-blocker').click(function (e) {
        e.preventDefault();
        var btn = $(this);
        btn.text('لطفا صبر کنید ...');

        var pageid = $('#sfpageid').val();
        var sf_block_theroles = [];
        $('.sf-block-theroles input:checked').each(function () {
            sf_block_theroles.push($(this).data('role'));
        });
        
        $.ajax({
            type: 'POST',
            url: myAjax.ajaxurl,
            data: {
                pageid : pageid,
                sf_block_theroles: sf_block_theroles,
                'action': 'sf_saveRolesBlocker'
            },
            success: function (data) {
                // var mydata = JSON.parse(data);
                // console.log(mydata);
                btn.text('ذخیره تغییرات');
            },
        });
    });

    $('.get-next-step-order').click(function (e) { 
        e.preventDefault();
        var thisel = $(this);
        var orderID = $(this).data('orderid');
        var ordStatus = $(this).data('status');
        var statusTxtelem = $(this).parent().find('.order-status-text');
        $.alert({
            theme:'modern',
            title: 'هشدار',
            content: 'آیا از انجام این عملیات مطمئن هستید؟',
            type: 'orange',
            typeAnimated: true,
            buttons: {
                no: {
                    text: 'خیر',
                    btnClass: ['sf-btn', 'sf-btn-outline-primary'],
                    keys: ['shift', 'esc'],
                    action: function(){}
                },
                yes: {
                    text: 'بله مطمئنم',
                    btnClass: ['sf-btn', 'sf-btn-primary'],
                    keys: ['enter'],
                    action: function () {
                        $('.sf-bg-loader').removeClass('d-none');
                        $.ajax({
                            type: 'POST',
                            url: myAjax.ajaxurl,
                            data: {
                                orderID : orderID,
                                ordStatus: ordStatus,
                                'action': 'sfChangeOrderStatus'
                            },
                            success: function (data) {
                                $('.sf-bg-loader').addClass('d-none');
                                var orderStatusTxt = '';
                                switch (ordStatus) {
                                    case 'preparing':
                                        orderStatusTxt = 'درحال آماده سازی';
                                        break;
                                    case 'packing':
                                        orderStatusTxt = 'درحال بسته بندی';
                                        break;
                                    case 'sending':
                                        orderStatusTxt = 'درحال ارسال';
                                        break;
                                    case 'delivery':
                                        orderStatusTxt = 'تحویل به مشتری';
                                        break;
                                    case 'complete':
                                        orderStatusTxt = 'کامل شده';
                                        break;
                                    default:
                                        orderStatusTxt = 'نامشخص';
                                        break;
                                }
                                statusTxtelem.text(orderStatusTxt);
                                thisel.remove();
                            },
                        });
                    }
                }
            }
        });
    });

    // show order details by click 
    $('.sf-get-order-details').click(function () {
        $('#edit-order-modal .modal-dialog').css('filter', 'blur(3)');
        $('.sf-bg-loader').removeClass('d-none');
        var orderID = $(this).data('orderid');
        $.ajax({
            type: 'POST',
            url: myAjax.ajaxurl,
            data: {
                orderID : orderID,
                'action': 'sfGetOrderDetails'
            },
            success: function (data) {
                $('#edit-order-modal .modal-dialog').css('filter', 'blur(0)');
                $('.sf-bg-loader').addClass('d-none');
                var mydata = JSON.parse(data);

                $('.sf-payment-method').text(mydata.payment_method);
                $('.sf-track-order').text(mydata.track_order);
                $('.sf-user-name').text(mydata.first_name + '-' + mydata.last_name);
                $('.sf-state').text(mydata.state);
                $('.sf-city').text(mydata.city);
                $('.sf-deliverydate').text((mydata.deliverydate)?mydata.deliverydate:'مشخص نشده');

                $('.sf-product-table tbody').empty()
                for (let index = 0; index < (mydata.products).length; ) {
                    var item = mydata.products[index];
                    var tr =
                        '<tr>'+
                        '<td>'+item.product_name+'</td>'+
                        '<td>'+item.sku+'</td>'+
                        '<td>'+item.quantity+'</td>'+
                        '<td>'+numberWithCommas(item.total)+'</td>'+
                        '</tr>'
                    ;
                    $('.sf-product-table tbody').append(tr);

                    index++;
                }
            },
        });
    });

    // create transaction
    $('.btn-send-payment-link').click(function () {
        // $.ajax({
        //     type: 'POST',
        //     url: myAjax.ajaxurl,
        //     data: {
        //         order_id : 515,
        //         amount : 500000,
        //         name : 'morteza',
        //         phone : '09109973124',
        //         mail : 's.m.yasrebi1380@gmail.com',
        //         desc : 'این از تراکنش تست',
        //         'action': 'sf_createTransaction'
        //     },
        //     success: function (data) {
        //         var mydata = JSON.parse(data);
        //         console.log(mydata);
        //     },
        // });
    });

    // payment status checker 
    $('.ckeck-peyment-status-btn').click(function () {
        $(this).addClass('sf-animate-spin');
    });

    // show products pending for packing
    $('.get-products-for-packing').click(function () {
        $('#show-products-modal .modal-dialog').css('filter', 'blur(3)');
        $('.sf-bg-loader').removeClass('d-none');
        
        $.ajax({
            type: 'POST',
            url: myAjax.ajaxurl,
            data: {
                'action': 'sfGetOrdersProducts'
            },
            success: function (data) {
                $('#show-products-modal .modal-dialog').css('filter', 'blur(0)');
                $('.sf-bg-loader').addClass('d-none');
                var mydata = JSON.parse(data);
                console.log(mydata.length);

                $('.sf-product-table tbody').empty()
                for (let index = 0; index < mydata.length; ) {
                    var item = mydata[index];
                    var tr =
                        '<tr>'+
                        '<td>'+item.pname+'</td>'+
                        '<td>'+item.psku+'</td>'+
                        '<td>'+item.pqty+'</td>'+
                        '</tr>'
                    ;
                    $('.sf-product-table tbody').append(tr);

                    index++;
                }
            },
        });
    });
});