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
        }
    },
    watch: {},
    methods: {
        onSave: async function (close = false) {
            try {
                let formData = {...this.form};
                let res = await this.insertClaim(formData);
                toastr.success(res.message)
                if (close) {
                    let _this = this
                    setTimeout(() => {
                        window.removeEventListener('beforeunload', _this.leaving, true)
                        window.location = "/p/" + formData.placeId
                    }, 1000)
                }
            } catch (error) {
                console.log(error);
                toastr.error("Duh ada error, coba tanya Ala Rai")
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

    },
    mounted() {
        window.addEventListener('beforeunload', this.leaving, true);
    }
})
