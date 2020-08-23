var app = new Vue({
    el: '#form-place',
    data: {
        isEdit: false,
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
            facilities: [],
            covid: [],
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
                {type: "whatsapp", value: ''},
                {type: "instagram", value: ''}
            ]
        },
        formTmp: {
            cuisine: '',
            payment: '',
            photo: null,
            galleries: []
        },
        formFieldValues: {
            place_categories: [],
            cuisines: [],
            payments: [],
            facilities: [],
            covid_prot: []
        }
    },
    watch: {
        'form.name': {
          deep: true,
          handler: function(val){
            let _this = this;
            if(!this.isEdit)
                setTimeout(function(){
                    let uniqStr = CryptoJS.MD5(new Date().toString()).toString().substring(0,5);
                    if(_this.form.name.length > 3)
                        _this.form.slug = slugify(val+' '+uniqStr);
                    else _this.form.slug = ''
                },300);
            
          }
        }
    },
    methods: {
        setSideMenuIndex: function(idx) {
            this.sideMenuIndex = idx
        },
        isActiveSideMenu: function(id) {
            return this.sideMenuIndex == id
        },
        isFacilityChecked: function(facility){
            let [first] = this.form.facilities.filter(e => e.name == facility);
            return first? true: false;
        },
        onFacilityChecked: function(facility){
          if(!this.isFacilityChecked(facility)){
            this.form.facilities.push({name:facility})
          } else {
            this.form.facilities = this.form.facilities.filter(e => e.name != facility)
          }
        },
        isCovidProtChecked: function(prot){
            let [first] = this.form.covid.filter(e => e == prot.type);
            return first? true: false;
        },
        onCovidProtChecked: function(prot){
          if(!this.isCovidProtChecked(prot)){
            this.form.covid.push(prot.type)
          } else {
            this.form.covid = this.form.covid.filter(e => e != prot.type)
          }
        },
        onPhotoChange: function(e){
            try {
                let _this = this;
                let [file] = e.target.files;
                if(!file) throw Error("File kosong");
                this.formTmp.photo = file;
                let reader = new FileReader();
                reader.onload = function(e) {
                    _this.$refs.photo.src = e.target.result
                    console.log(e.target.result);
                }
                reader.readAsDataURL(file);
            } catch (error) {
                console.error(error)
                return;
            }
            
        },
        onSave: function(close = false){
            let formData = {...this.form};
            formData.cuisines = formData.cuisines.map(e => (e.text));
            formData.payments = formData.payments.map(e => ({code: e.code, name: e.text})); 
            console.log(formData);
            console.log([...this.formTmp.galleries]);
            if(close){
                window.removeEventListener('beforeunload', ()=>{
                    
                });
                setTimeout(()=>{window.location = '/admin/places';}, 300)
                
            }
            
        },
        addGalleryFile: function(e, groupId){
            let _this = this;
            const files = e.target.files || e.dataTransfer.files;
            ([...files]).forEach(function(f){
                let idx = _this.formTmp.galleries.findIndex(e => e.id == groupId);
                let reader = new FileReader();
                reader.onload = function(e) {
                    _this.formTmp.galleries[idx].images.push({file: f, imgData: e.target.result});
                }
                reader.readAsDataURL(f);
            });
            
        },
        deleteGalleryFile: function(groupId, idx){
            this.formTmp.galleries.map(e => {
                if(e.id == groupId)
                    e.images = e.images.filter((e1,i) => (i != idx));

                return e;
            })
            
        },
        addGalleryGroup: function(){
            let id = CryptoJS.MD5(new Date().toTimeString()).toString();
            this.formTmp.galleries.push(
                {id, category:'', images:[]}
            )
        },
        deleteGalleryGroup: function(groupId){
            this.formTmp.galleries = this.formTmp.galleries.filter((e) => (e.id != groupId));
        },
        loadPlaceCategories: async function(){
            const ctx = this;
            fetch('/api/v1/place_categories')
            .then(res => res.json()).then(res => res.map(e => (e.name)))
            .then(res => ctx.formFieldValues.place_categories = res);
        },
        loadCuisines: async function(){
            const ctx = this;
            fetch('/api/v1/cuisines').then(res => res.json()).then(res => res.map(e => ({text: e.name})))
            .then(res => ctx.formFieldValues.cuisines = res);
        },
        loadPayments: async function(){
            const ctx = this;
            fetch('/api/v1/payments').then(res => res.json()).then(res => res.map(e => ({code:e.code, text: e.name})))
            .then(res => ctx.formFieldValues.payments = res);
        },
        loadFacilities: async function(){
            const ctx = this;
            fetch('/api/v1/facilities').then(res => res.json()).then(res => res.map(e => (e.name)))
            .then(res => ctx.formFieldValues.facilities = res);
        },
        loadCovidProtocols: async function(){
            const ctx = this;
            fetch('/api/v1/covid-protocols').then(res => res.json())
            .then(res => ctx.formFieldValues.covid_prot = res);
        },
        leaving: function (event) {
            // Cancel the event as stated by the standard.
            event.preventDefault();
            // Chrome requires returnValue to be set.
            event.returnValue = '';
        },
    },
    mounted() {
        this.loadPlaceCategories()
        this.loadCuisines()
        this.loadPayments()
        this.loadFacilities()
        this.loadCovidProtocols()
        window.addEventListener('beforeunload', function (event) {
            // Cancel the event as stated by the standard.
            event.preventDefault();
            // Chrome requires returnValue to be set.
            event.returnValue = '';
        });
    }
})
