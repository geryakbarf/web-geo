var app = new Vue({
    el: '#form-place',
    data: {
        sideMenuIndex: 0,
        form: {
            name: '',
            slug: '',
            city: '',
            address: '',
            type: '',
            description: '',
            cuisines: [],
            payments: [],
            operational_times: [
                {day: 'Senin', openTime: '00:00', closeTime: '00:00'},
                {day: 'Selasa', openTime: '00:00', closeTime: '00:00'},
                {day: 'Rabu', openTime: '00:00', closeTime: '00:00'},
                {day: 'Kamis', openTime: '00:00', closeTime: '00:00'},
                {day: 'Jumat', openTime: '00:00', closeTime: '00:00'},
                {day: 'Sabtu', openTime: '00:00', closeTime: '00:00'},
                {day: 'Minggu', openTime: '00:00', closeTime: '00:00'},
            ],
            call_to_actions: [
                {type: "gmaps", value: ''},
                {type: "whatsapp", value: ''}
            ]
        },
        formTmp: {
            cuisine: '',
            payment: '',
        },
        formFieldValues: {
            place_categories: [],
            cuisines: [],
            payments: []
        }
    },
    methods: {
        setSideMenuIndex: function(idx) {
            this.sideMenuIndex = idx
        },
        isActiveSideMenu: function(id) {
            return this.sideMenuIndex == id
        },
        onSave: function(){
            let formData = {...this.form};
            formData.cuisines = formData.cuisines.map(e => (e.text));
            formData.payments = formData.payments.map(e => ({code: e.code, name: e.text})); 
            console.log(formData);
        },
        loadPlaceCategories: async function(){
            const ctx = this;
            fetch('/api/v1/place_categories')
            .then(res => res.json())
            .then(res => res.map(e => (e.name)))
            .then(res => ctx.formFieldValues.place_categories = res);
        },
        loadCuisines: async function(){
            const ctx = this;
            fetch('/api/v1/cuisines')
            .then(res => res.json())
            .then(res => res.map(e => ({text: e.name})))
            .then(res => ctx.formFieldValues.cuisines = res);
        },
        loadPayments: async function(){
            const ctx = this;
            fetch('/api/v1/payments')
            .then(res => res.json())
            .then(res => res.map(e => ({code:e.code, text: e.name})))
            .then(res => ctx.formFieldValues.payments = res);
        }
    },
    mounted() {
        this.loadPlaceCategories()
        this.loadCuisines()
        this.loadPayments()
    }
})