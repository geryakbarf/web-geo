
var app = new Vue({
    el: '#list-place',
    data: {
        filter: '',
        placeCols: [
            {label: '#'},
            {label: 'Place Name', field:"name"},
            {label: 'Location', field:"city"},
            {label: 'Action'}
        ],
        places: []
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
        loadPlaces: async function() {
            const res = await fetch('/api/v1/places');
            const data = await res.json();
            if(res.ok) this.places = data.data;
            else toastr.error("Failed to retrive data"); 
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
