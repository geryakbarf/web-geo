var app = new Vue({
    el: '#form-owner',
    data : {
        sideMenuIndex : 0,
        form : {
            _id : null,
            name : "",
            contact : "",
            subscription : "",
            addon: "",
            contactType: "",
            contactNumber: "",
            addons:"",
            placesId : []
        },
    },
    methods: {
        setSideMenuIndex: function (idx) {
            this.sideMenuIndex = idx
        },
        isActiveSideMenu: function (id) {
            return this.sideMenuIndex == id
        },
        onCancel: function () {
            window.addEventListener('beforeunload', this.leaving, true);
            window.location = `/admin/owners`
        },
        onSave : async function(close = false){
            try{
                let formData = {...this.form};
                let res = null;
                res = await this.addOwner(formData);
                console.log(res.data);
                if (this.form._id == null)
                    this.form._id = res.data.id;
                toastr.success(res.message)
                // if (close) {
                //     let _this = this
                //     setTimeout(() => {
                //         window.removeEventListener('beforeunload', _this.leaving, true)
                //         window.location = "/admin/places/" + this.form._id + "/edit?nav=" + this.sideMenuIndex
                //     }, 1000)
                // }
            }catch (e) {
                console.log(e)
                toastr.error("Duh ada error, coba tanya Gery Akbar")
            }

        },
        addOwner: async function (formData) {
            try {
                const res = await fetch('/api/v1/owners', {
                    method: "POST",
                    body: JSON.stringify(formData),
                    headers: {'Content-Type': "application/json"}
                });
                const data = await res.json();
                return Promise.resolve(data);
            } catch (error) {
                console.log(error);
                return Promise.reject(error);
            }
        },
    },
    mounted(){

    },
    computed: {

    }
})