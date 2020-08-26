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
            is_draft: false,
            is_partner: false,
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
            this.createPlace(formData);
            if(close){
                window.removeEventListener('beforeunload',this.leaving, true)
                window.location = "/admin/places"
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
        createPlace: async function(formData){
            try {
                const res = await fetch('/api/v1/places',{method: "POST", body: JSON.stringify(formData), headers:{'Content-Type':"application/json"}});
                console.log(await res.json());
            } catch (error) {
                console.log(error);
            }
        },
        loadPlaceCategories: async function(){
            try {
                const res = await fetch('/api/v1/place-categories');
                const data = await res.json();
                this.formFieldValues.place_categories = data.map(e => (e.name))    
            } catch (error) {
                console.log(error);
            }
        },
        loadCuisines: async function(){
            try {
                const res = await fetch('/api/v1/cuisines');
                const data = await res.json();
                this.formFieldValues.cuisines = data.map(e => ({text: e.name}))    
            } catch (error) {
                console.log(error);
            }
        },
        loadPayments:  async function(){
            try {
                const res = await fetch('/api/v1/payments');
                const data = await res.json();
                this.formFieldValues.payments = data.map(e => ({code:e.code, text: e.name}))   
            } catch (error) {
                console.log(error);
            }
        },
        loadFacilities: async function(){
            try {
                const res = await fetch('/api/v1/facilities');
                const data = await res.json();
                this.formFieldValues.facilities = data.map(e => (e.name))   
            } catch (error) {
                console.log(error);
            }
        },
        loadCovidProtocols: async function(){
            try {
                const res = await fetch('/api/v1/covid-protocols');
                const data = await res.json();
                this.formFieldValues.covid_prot = data   
            } catch (error) {
                console.log(error);
            }
        },
        leaving: function (event) {
            event.preventDefault();
            event.returnValue = '';
        }
    },
    mounted() {
        this.loadPlaceCategories()
        this.loadCuisines()
        this.loadPayments()
        this.loadFacilities()
        this.loadCovidProtocols()
        window.addEventListener('beforeunload', this.leaving, true);
    }
})
