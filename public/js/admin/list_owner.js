var app = new Vue({
    el: '#list-owner',
    data: {
        admin: username,
        sideMenuIndex: 0,
        filter: '',
        filterdraft: '',
        filterpublish: '',
        filterupdated: '',
        ownerCols: [
            {label: '#'},
            {label: 'Nama', field: "name"},
            {label: 'Last Update', field: "lastUpdate"},
            {label : 'Next Update', field: "nextUpdate"},
            {label: 'Nama Restoran', field: "placeName"},
            // {label: 'Update Berikutnya', field: "nextUpdate"},
            {label: 'Action'}
        ],
        owner: [],
        places_draft: [],
        places_publish: [],
        places_updated: []
    },
    methods: {
        formatToday: function (date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [year, month, day].join('-');
        },

        compareDate: function (lastUpdate, condiiton) {
            var updatedAt = '';
            const unformatToday = this.formatToday(new Date());
            //Format date to YYYY-MM-DD
            const formattedDate = lastUpdate.substring(0, 10);
            const formattedToday = unformatToday.substring(0, 10);
            const hour = lastUpdate.substring(11, 16);
            const formatdate1 = formattedDate.split("-");
            const formatdate2 = formattedToday.split("-");
            //Compare Days Between Date
            const one_day = 1000 * 60 * 60 * 24;
            const date1 = new Date(formatdate1[0], (formatdate1[1] - 1), formatdate1[2]);
            const date2 = new Date(formatdate2[0], (formatdate2[1] - 1), formatdate2[2]);
            const diff = Math.ceil(parseInt((date2.getTime() - date1.getTime()) / (one_day)));
            //If Condition
            if (diff === 0)
                updatedAt = 'Today'
            else if (diff === 1)
                updatedAt = 'Yesterday'
            else if (diff === 2)
                updatedAt = diff + ' days ago'
            else
                updatedAt = lastUpdate.substring(0, 10);
            if (condiiton)
                return updatedAt.substring(0, 10);
            else
                return updatedAt;
        },

        setSideMenuIndex: function (idx) {
            this.sideMenuIndex = idx
        },
        isActiveSideMenu: function (id) {
            return this.sideMenuIndex == id
        },

        updateTime: async function (id, name) {
            const res = await fetch('/api/v1/places', {
                method: "PUT",
                body: JSON.stringify({_id: id, name}),
                headers: {'Content-Type': "application/json"}
            });
            if (res.ok) {
                toastr.success("Success to update time")
                this.loadPlaces();
            } else toastr.error("Failed to delete data");

        },
        updateTimeAll: async function () {
            var success = false;
            if (this.places_publish.length > 0) {
                for (var i = 0; i < this.places_publish.length; i++) {
                    const res = await fetch('/api/v1/places', {
                        method: "PUT",
                        body: JSON.stringify({
                            _id: this.places_publish[i]._id,
                            name: this.places_publish[i].name
                        }),
                        headers: {'Content-Type': "application/json"}
                    });
                    if (res.ok)
                        success = true
                    else {
                        success = false;
                        break;
                    }
                }
                if (success) {
                    toastr.success("Success to update time")
                    this.loadPlaces();
                } else toastr.error("Failed to update data");
            } else
                toastr.error("There are no places to be updated :/")
        },
        loadOwners: async function () {
            const res = await fetch('/api/v1/owners');
            const data = await res.json();
            if (res.ok) {
                this.owner = data.data;
                for (let i = 0; i < this.owner.length; i++) {
                    this.owner[i].lastUpdate = this.compareDate(this.owner[i].updatedAt, false);
                    this.owner[i].nextUpdate = this.compareDate(this.owner[i].nextUpdate,true);
                }
                console.log(this.owner[0].placeName);
            } else toastr.error("Failed to retrive data");
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    mounted() {
        this.loadOwners();
    },
})
