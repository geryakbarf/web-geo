var app = new Vue({
    el: '#form-place',
    data: {
        sideMenuIndex: 0,
        form: {
            _id: null,
            name: '',
            slug: '',
            city: '',
            address: '',
            categories: [],
            parkir: '',
            // description: '',
            is_draft: true,
            is_partner: false,
            is_halal: true,
            photo: null,
            cuisines: [],
            payments: [],
            facilities: [],
            covid: [],
            galleries: [],
            operational_times: [
                {day: 'Senin', openTime: '00:00', closeTime: '00:00', is_open: true},
                {day: 'Selasa', openTime: '00:00', closeTime: '00:00', is_open: true},
                {day: 'Rabu', openTime: '00:00', closeTime: '00:00', is_open: true},
                {day: 'Kamis', openTime: '00:00', closeTime: '00:00', is_open: true},
                {day: 'Jumat', openTime: '00:00', closeTime: '00:00', is_open: true},
                {day: 'Sabtu', openTime: '00:00', closeTime: '00:00', is_open: true},
                {day: 'Minggu', openTime: '00:00', closeTime: '00:00', is_open: true},
            ],
            call_to_actions: [
                {type: "gmaps", value: ''},
                {type: "whatsapp", value: ''},
                {type: "instagram", value: ''},
                {type: "web", value: ''},
                {type: "grabfood", value: ''},
                {type: "gofood", value: ''},
                {type: "checkin", value: ''},
            ]
        },
        formTmp: {
            place_categories: '',
            payment: '',
            photo: null,
            galleries: []
        },
        formFieldValues: {
            place_categories: [],
            cuisines: [],
            payments: [],
            facilities: [],
            covid_prot: [],
            parkirs: [
                {
                    id:"5f54e8aa62288f9dcff1c9dd",
                    name: "Motor"
                },
                {
                    id:"5f54e8cb62288f9dcff1ce82",
                    name: "Motor & Mobil"
                }
            ]
        },
        menus: []
    },
    watch: {
        'form.name': {
          deep: true,
          handler: function(val){
            let _this = this;
            if(this.form._id == null)
                setTimeout(function(){
                    if(val.length > 3){
                        let s = val;
                        if(_this.form.city.length > 0) s += ' '+_this.form.city;
                        _this.form.slug = slugify(s);
                    } else {
                        _this.form.slug = ''
                    }    
                    
                },300);
            
          }
        },
        'form.city': {
            deep: true,
            handler: function(val){
              let _this = this;
              if(this.form._id == null)
                  setTimeout(function(){
                      if(_this.form.name.length > 3){
                          let s = _this.form.name;
                          if(val.length > 0) s += ' '+val;
                          _this.form.slug = slugify(s);
                      } else {
                          _this.form.slug = ''
                      }    
                      
                  },100);
              
            }
        },
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
                }
                reader.readAsDataURL(file);
            } catch (error) {
                console.error(error)
                return;
            }
            
        },
        _onSaveParams: async function(){
            let formData = {...this.form};
            let photoTmp = this.formTmp.photo;
            let photo = formData.photo;
            let [parkir] = this.formFieldValues.parkirs.filter(e => (e.id == formData.parkir));
            formData.parkir = parkir;
            formData.categories = formData.categories.map(e => ({id: e.id, name: e.text}));
            formData.payments = formData.payments.map(e => ({code: e.code, name: e.text}));
            formData.galleries = await this.uploadGalleryImage();
            if(photoTmp){
                if((photo && photo.path != photoTmp.name)){
                    const images = [photo.path]
                    await fetch('/api/v1/delete-images',{method: "DELETE", body: JSON.stringify({images}), headers:{'Content-Type':"application/json"}},);
                    formData.photo = await this.photoUpload();
                }else if((!photo) || (!formData._id)){
                    formData.photo = await this.photoUpload();
                }
                    
            }

            return formData;
        },
        onSave: async function(close = false){
            try {
                const formData = await this._onSaveParams();
                let res = null;
                if(formData._id) res = await this.updatePlace(formData);
                else res = await this.createPlace(formData);
                toastr.success(res.message)
                if(close){
                    let _this = this
                    setTimeout(() =>{
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        window.location = "/admin/places"
                    }, 1000)
                }    
            } catch (error) {
                console.log(error);
                toastr.error("Duh ada error, coba tanya Ala Rai")
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
        addGalleryGroup: function(catName){
            let id = CryptoJS.MD5(new Date().toTimeString()).toString();
            this.formTmp.galleries.push(
                {id, category: catName, images:[]}
            )
        },
        deleteGalleryGroup: function(groupId){
            if(this.form._id != null){
                if(confirm("Are you sure want to delete this gallery group?"))
                    this.formTmp.galleries = this.formTmp.galleries.filter((e) => (e.id != groupId));    
            }else{
                this.formTmp.galleries = this.formTmp.galleries.filter((e) => (e.id != groupId));
            }
            
        },
        uploadGalleryImage: async function() {
            let currImages = this.form.galleries;
            let uploads = [];
            this.formTmp.galleries.forEach(e => {
                e.images.forEach(e1 => {
                    uploads.push({category: e.category, file: e1.file })
                })
            })
            console.log("currImages",currImages);

            let newImages = uploads.filter(e => currImages.map(e2=>e2.path).indexOf(e.file.name) === -1);
            console.log("newImages",newImages);

            let imagesNeedDelete = currImages.filter(e => {
                return uploads.map(e2=>(e2.file.name)).indexOf(e.path) === -1;
            });
            console.log("imagesNeedDelete",imagesNeedDelete);

            (async()=>{
                const images = imagesNeedDelete.map(e=>(e.path));
                if(images.length > 0){
                    const res = await fetch('/api/v1/delete-images',{method: "DELETE", body: JSON.stringify({images}), headers:{'Content-Type':"application/json"}},);
                    const data = await res.json();
                    console.log(data);
                }
                
            })()

            currImages = currImages.filter(e => imagesNeedDelete.map(e2=> e2.path).indexOf(e.path) === -1);
            console.log("currImages",currImages);

            newImages = newImages.map(async (e)=> {
                try {
                    let formData = new FormData();
                    formData.append('file', e.file)
                    const params = { method: 'POST', body: formData};
                    const res = await fetch('/api/v1/upload-image-s3', params);
                    if(res.status != 200) throw Error("Upload gallery gagal!");
                    const data = await res.json();
                    const { path, options } = data.data;
                    return Promise.resolve({category: e.category, path, options});    
                } catch (error) {
                    return Promise.reject(error);
                }
            });

            newImages = await Promise.all(newImages);

            console.log([...currImages, ...newImages]);

            return [...currImages, ...newImages];
        },
        photoUpload: async function(){
            try {
                let formData = new FormData();
                formData.append('file', this.formTmp.photo)
                const params = { method: 'POST', body: formData};
                const res = await fetch('/api/v1/upload-image-s3', params);
                if(res.status != 200) throw Error("Upload photo gagal!");
                const data = await res.json();
                return Promise.resolve(data.data);
            } catch (error) {
                return Promise.reject(error);
            }
            
        },
        createPlace: async function(formData){
            try {
                const res = await fetch('/api/v1/places',{method: "POST", body: JSON.stringify(formData), headers:{'Content-Type':"application/json"}});
                const data = await res.json();
                return Promise.resolve(data);
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        },
        updatePlace: async function(formData){
            try {
                const res = await fetch('/api/v1/places',{method: "PUT", body: JSON.stringify(formData), headers:{'Content-Type':"application/json"}});
                const data = await res.json();
                return Promise.resolve(data);
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        },
        loadPlaceCategories: async function(){
            try {
                const res = await fetch('/api/v1/place-categories');
                const data = await res.json();
                this.formFieldValues.place_categories = data.map(e => ({id: e._id, text: e.name}))    
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
        loadGalleriesFromData: async function(){
            _.uniq(this.form.galleries.map(e => (e.category)))
            .forEach(e => {
                this.addGalleryGroup(e);
            });

            const catImages = this.formTmp.galleries.map( async (e) => {
                let images = this.form.galleries
                .filter(e1 => e1.category == e.category)
                .map(async(e2) => {
                    const res = await fetch(e2.path);
                    const blob = await res.blob();
                    let file = new File([blob],e2.path, {type: blob.type});
                    let imgData = await (()=>{
                        return new Promise((resolve) => {
                            let reader = new FileReader();
                            reader.onload = function(e3) {
                                resolve(e3.target.result)
                            }
                            reader.readAsDataURL(file);
                        })      
                    })();
                    
                    return {file, imgData};
                })
                images = await Promise.all(images) 
                return { id: e.id ,category: e.category, images };
            })
            this.formTmp.galleries = await Promise.all(catImages);
        },

        loadPhotoFromData: async function(){
            if(!this.form.photo) return;
            const _this = this;
            const fileUrl = this.form.photo.path;
            const res = await fetch(fileUrl);
            const blob = await res.blob();
            const file = new File([blob],fileUrl, {type: blob.type});
            this.formTmp.photo = file;
            let reader = new FileReader();
            reader.onload = function(e) {
                _this.$refs.photo.src = e.target.result
            }
            reader.readAsDataURL(file);
        },
        loadPlace: async function() {
            if(!placeId) return;
            try {
                const res = await fetch(`/api/v1/places/${placeId}`);
                const data = await res.json();
                this.form = data.data;
                this.form.categories = this.form.categories.map(e => ({id: e.id, text: e.name}));
                this.form.payments = this.form.payments.map(e => ({code: e.code, text: e.name}));
                if(this.form.parkir)
                    this.form.parkir = this.form.parkir.id;
                this.formFieldValues.payments = this.form.payments; 
                this.loadGalleriesFromData();
                this.loadPhotoFromData();
            } catch (error) {
                console.log(error);
            }
        },
        loadMenus: async function(){
            if(!placeId) return;
            try {
                const res = await fetch(`/api/v1/places/${placeId}/menus`);
                const data = await res.json();
                this.menus = data.data;
            } catch (error) {
                console.log(error);
            }
        },
        leaving: function (event) {
            event.preventDefault();
            event.returnValue = '';
        },
        editMenu: function(placeId, menuId){
            // console.log(`/admin/places/${placeId}/menus/${menuId}`);
            window.removeEventListener('beforeunload', this.leaving, true)
            window.location = `/admin/places/${placeId}/menus/${menuId}`
        }
    },
    mounted() {
        this.loadPlace()
        this.loadPlaceCategories()
        this.loadCuisines()
        this.loadPayments()
        this.loadFacilities()
        this.loadCovidProtocols()
        this.loadMenus()
        window.addEventListener('beforeunload', this.leaving, true);
    }
})
