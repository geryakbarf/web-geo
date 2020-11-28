var formFoodlistApp = new Vue({
    el: "#form-foodlist",
    template: `
    <div class="container">
        <div class="pd-layout-section">
            <section class="section-profile row justify-content-center">
                <div class="col-lg-6 col-md-8 col-12">
                    <div class="text-center" style="display: block">
                        <h4>{{pageTitle}} Foodlist</h4>
                        <img src="/assets/images/emam-menu-no-photos.jpg" class="image-rectangle mx-auto mb-3"
                            style="display: block;">
                        <input id="banner" style="display:none;" type="file" v-on:change="onBannerChange"/>
                        <a href="#">
                            <label for="banner" class="mx-auto" style="display: inline;">Ubah cover foodlist</label>
                        </a>
                    </div>
                    <div class="form-group mt-48">
                        <label>Judul</label>
                        <input type="text" name="nama" v-model="form.nama" class="form-control box-text">
                    </div>
                    <div class="form-group">
                        <label>Deskripsi (Opsional)</label>
                        <textarea class="form-control box-text" name="bio" v-model="form.bio" required="required" rows="4" style="resize: none;"
                            type="text"></textarea>
                    </div>
                    <div class="form-group">
                        <p class="no-sp" style="font-weight: bold;">Rahasiakan foodlist ini</p>
                        <p class="text-grey">Jadi, hanya anda yang dapat melihatnya.</p>
                        <div class="switch-group">
                            <!-- <span class="my-auto">Public</span> -->
                            <label class="switch">
                                <input type="checkbox" name="is_private" v-model="form.is_private">
                                <span class="slider round"></span>
                            </label>
                            <!-- <span class="my-auto">Rahasiakan</span> -->
                        </div>
                    </div>
                    <p>anda perlu bantuan? <a href="#">hubungi kami</a></p>
                    <a href="/foodlist"><button class="btn btn-border mr-2">Kembali</button></a>
                    <button class="btn btn-fill">Simpan</button>
                </div>
            </section>
        </div>
    </div>

    `,
    data() {
        return {
            isEdit,
            form: {
                nama: null,
                bio: null,
                banner: null,
                is_private: false,
            },
            formTmp: {
                banner: null,
            },
        }
    },
    methods: {
        onBannerChange: function (e) {
            try {
                let _this = this;
                let [file] = e.target.files;
                if (!file) throw Error("File kosong");
                this.formTmp.banner = file;
                let reader = new FileReader();
                reader.onload = function (e) {
                    _this.$refs.banner.src = e.target.result
                }
                reader.readAsDataURL(file);
            } catch (error) {
                console.error(error)
            }

        },
    },
    computed: {
        pageTitle: function() {
            return this.isEdit ? "Ubah":"Buat";
        }
    },
    mounted(){

    }
});