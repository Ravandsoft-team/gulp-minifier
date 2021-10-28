
var app = new Vue({
    el: '#app',
    data: {
        date: '',
        put1: '00-00-00',
        put2: '00-00-00',
    },
    components: {
        DatePicker: VuePersianDatetimePicker,
    },
    methods: {
        output1(e) {
            this.put1 = e;
        },
        output2(e) {
            this.put2 = e;
        },
        put1(e) {
            console.log(e);
        }
    },
});

new Vue({
    el: '#app2',
    data: {
        date: '',
    },
    components: {
        DatePicker: VuePersianDatetimePicker,
    },
    methods: {

    },
});
