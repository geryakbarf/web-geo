
var app = new Vue({
    el: '#list-place',
    data: {
        sideMenuIndex: 0,
        filter: '',
        filterdraft: '',
        placeCols: [
            {label: '#'},
            {label: 'Place Name', field:"name"},
            {label: 'Last Update', field:"updatedAt"},
            {label: 'Action'}
        ],
        placeColsDraft: [
            {label: '#'},
            {label: 'Place Name', field:"name"},
            {label: 'Last Update', field:"updatedAt"},
            {label: 'Action'}
        ],
        places: [],
        places_draft: []
    },
    methods: {
        onDeleteData: async function(id) {
            if(confirm('Are you sure want to delete this data?')){
                const res = await fetch(`/api/v1/places/${id}`, {method: "DELETE"});
                if(res.ok) {
                    toastr.success("Success to delete data")
                    this.loadPlaces();
                }
                else toastr.error("Failed to delete data");
            }else{
                return;
            }

        },

        setSideMenuIndex: function (idx) {
            this.sideMenuIndex = idx
        },
        isActiveSideMenu: function (id) {
            return this.sideMenuIndex == id
        },

        updateTime: async function(id, name) {
            const res = await fetch('/api/v1/places',{method: "PUT", body: JSON.stringify({_id: id, name}), headers:{'Content-Type':"application/json"}});
            if(res.ok) {
                toastr.success("Success to update time")
                this.loadPlaces();
            }
            else toastr.error("Failed to delete data");

        },
        loadPlaces: async function() {
            const res = await fetch('/api/v1/places');
            const data = await res.json();
            if(res.ok) {
                this.places = data.data;
                this.places_draft = data.data.filter(e => e.is_draft);;
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
        this.loadPlaces();
    }
})
