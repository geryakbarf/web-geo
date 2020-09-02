var app = new Vue({
    el: '#form-menu',
    data: {
        sideMenuIndex: 0,
        form: {
            _id: null,
            name: '',
            description: '',
            placeId: null,
            prices: {
                normal_price: 0,
                sale_price: 0,
            },
            is_draft: false,
            photo: null,
        },
        formTmp: {
            photo: null,
        },
        formFieldValues: {
            menu_categories: []
        },
        catForm:{
            editMode: false,
        }
    },
    methods: {
        setSideMenuIndex: function(idx) {
            this.sideMenuIndex = idx
        },
        isActiveSideMenu: function(id) {
            return this.sideMenuIndex == id
        },
        toggleCatEditMode: function() {
            this.catForm.editMode = this.catForm.editMode == true ? false: true;
        },
        addCategory: function(){
            let id = CryptoJS.MD5(new Date().toString()).toString();
            this.formFieldValues.menu_categories.push({id, name: ''})
        },
        deleteCategory: function(id){
            this.formFieldValues.menu_categories = this.formFieldValues.menu_categories.filter(e => e.id != id);
        },
        saveCategory: async function(){
            if(this.formFieldValues.menu_categories.length == 0) return;
            try {
                let categories = this.formFieldValues.menu_categories.map(e=> (e.name));
                const res = await fetch(`/api/v1/places/${placeId}/menu-categories`,{method: "PUT", body: JSON.stringify({categories}), headers:{'Content-Type':"application/json"}});
                const data = await res.json();
                this.catForm.editMode = false;
                toastr.success(data.message);
            } catch (error) {
                toastr.error("Duh ada error, coba tanya Ala Rai")
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
            formData.category = formData.category.name; 
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
                if(formData._id)
                    res = await this.updateMenu(formData);
                else
                    res = await this.createMenu(formData);
                toastr.success(res.message)
                if(close){
                    let _this = this
                    setTimeout(() =>{
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        window.location = `/admin/places/${placeId}/edit`
                    }, 1000)
                }    
            } catch (error) {
                toastr.error("Duh ada error, coba tanya Ala Rai")
            }
            
        },
        createMenu: async function(formData){
            try {
                const res = await fetch('/api/v1/menus',{method: "POST", body: JSON.stringify(formData), headers:{'Content-Type':"application/json"}});
                const data = await res.json();
                return Promise.resolve(data);
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        },
        updateMenu: async function(formData){
            try {
                const res = await fetch('/api/v1/menus',{method: "PUT", body: JSON.stringify(formData), headers:{'Content-Type':"application/json"}});
                const data = await res.json();
                return Promise.resolve(data);
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        },
        deleteMenu: async function(){
            if(confirm('Are you sure want to delete this menu?')){
                try {
                    const res = await fetch(`/api/v1/menus/${menuId}`,{method: "DELETE"});
                    const data = await res.json();
                    toastr.success(data.message);
                    var _this = this;
                    setTimeout(() =>{
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        window.location = `/admin/places/${placeId}/edit`
                    }, 1000)
                } catch (error) {
                    console.log(error);
                    toastr.error("Gagal menghapus menu, tanya Ala Rai")
                }
            }
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
        loadMenu: async function() {
            if(!menuId) return;
            try {
                const res = await fetch(`/api/v1/menus/${menuId}`);
                const {data} = await res.json();
                this.form = data;
                const [selectedCat] = this.formFieldValues.menu_categories.filter(e=> e.name == data.category);
                this.form.category = selectedCat; 
                this.loadPhotoFromData();
            } catch (error) {
                console.log(error);
            }
        },
        loadCategories: async function(){
            if(!placeId) return;
            try {
                const res = await fetch(`/api/v1/places/${placeId}/menu-categories`);
                const data = await res.json();
                this.formFieldValues.menu_categories = data.data.map((name, idx) => {
                    let id = CryptoJS.MD5((new Date().toString())+idx).toString();
                    return {id,name};
                });
                this.loadPhotoFromData();
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
        this.form.placeId = placeId;
        (async ()=>{
            await this.loadCategories();
            await this.loadMenu();
        })()
        
        window.addEventListener('beforeunload', this.leaving, true);
    }
})