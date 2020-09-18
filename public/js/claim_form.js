var app = new Vue({
    el: '#form-claim',
    data: {
        form: {
            placeId: placeID,
            ownerName: '',
            ownerPhoneNumber: '',
            placeAddress: '',
            operational_times: [
                {day: 'Senin', openTime: '00:00', closeTime: '00:00', is_open: true},
                {day: 'Selasa', openTime: '00:00', closeTime: '00:00', is_open: false},
                {day: 'Rabu', openTime: '00:00', closeTime: '00:00', is_open: false},
                {day: 'Kamis', openTime: '00:00', closeTime: '00:00', is_open: false},
                {day: 'Jumat', openTime: '00:00', closeTime: '00:00', is_open: false},
                {day: 'Sabtu', openTime: '00:00', closeTime: '00:00', is_open: false},
                {day: 'Minggu', openTime: '00:00', closeTime: '00:00', is_open: false},
            ],
        },
        robot: true
    },
    watch: {},
    methods: {
        onSave: async function (close = false) {
            console.log(this.robot);
            if(this.robot){
                swal("Oppss!", "Verifikasi robot belum valid.", "error");
                return false;
            }
            try {
                let formData = {...this.form};
                let res = await this.insertClaim(formData);
                swal("Terima kasih!", "Tim emam akan segera menghubungi kamu", "success");
                if (close) {
                    let _this = this
                    setTimeout(() => {
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        window.location = "/p/" + formData.placeId
                    }, 1000)
                }
            } catch (error) {
                console.log(error);
                swal("Oppss!", "Terjadi kesalaham mohon hubungi admin emam.", "error");
            }
        },
        insertClaim: async function (formData) {
            
            try {
                const res = await fetch('/api/v1/claim/send-claim', {
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
        onVerify: function(response) {
            if (response) this.robot = false;
        }

    },
    mounted() {
        window.addEventListener('beforeunload', this.leaving, true);
    },
    components: {
        'vue-recaptcha': VueRecaptcha
    },
})
