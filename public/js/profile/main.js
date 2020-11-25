Vue.component('UserSection', UserSection);
Vue.component('WishListTab', WishListTab);
Vue.component('FoodListTab', FoodListTab);
Vue.component('TabSection', TabSection);
var profilePageApp = new Vue({
    el: "#vprofile",
    template: `
        <div class="container">
            <div class="pd-layout-section">
                <div v-if="loading" class="row justify-content-center">
                    <div style="height: 300px; padding: 100px 0;">
                        <i class="fa fa-spinner fa-pulse fa-5x fa-fw" style="color: #e92737;"></i>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
                <div v-if="!loading">
                    <user-section />
                    <tab-section :on-tab-change="onTabChange" /> 
                    <section class="section-menu-profile">
                        <div class="tab-content">
                            <food-list-tab v-if="tabIndex == 1" />
                            <wish-list-tab v-if="tabIndex == 2" />
                        </div>
                    </section>
                </div>
                
            </div>
        </div>

    `,
    data() {
        return {
            loading: false,
            error: null,
            profile: {},
            tabIndex: 1
        }
    },
    methods: {
        onTabChange: function(index){
            this.tabIndex = index;
        },
        loadProfile: function(){
            const token = localStorage.getItem('token');
            const $this = this;
            this.loading = true;
            fetch(emapi_base+ "/v1/me",{
                method: "GET",
                headers: {
                    'Content-Type': "application/json",
                    'authorization': "Bearer "+token
                }
            }).then(function(res){
                if(res.status == 500) throw new Error("internal server error");
                return res.json();
            }).then(function(res){
                $this.loading = false;
                const data = res.data;
                $this.profile = {
                    nama: data.nama,
                    avatar: data.avatar,
                    bio: data.bio,
                    username: data.username,
                }
            }).catch(function(error){
                $this.loading = false;
            })
        }
    },
    mounted(){
        this.loadProfile();
    }
});