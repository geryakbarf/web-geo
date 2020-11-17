function loadUnauthenticated(){
    return `<li class="nav-item nav-item-button mx-md-2 py-2 inlineblock" style="padding-top: 13px!important;">
                <a class="nav-button" style="text-decoration: none;" href="/auth">Login</a>
            </li>`;
}

function loadAuthenticated(user){
    return `<li class="nav-item nav-item-button mx-md-2 py-2 inlineblock">
    <div class="dropdown show my-auto">
        <a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle my-auto"
            data-toggle="dropdown" href="#" id="dropdownMenuLink" role="button"
            style="text-decoration: none; color: #000;">
            <!-- Buka Tutup -->
            <img src="${user.avatar}" class="rounded-circle"
                style="object-fit: cover;" width="40" height="40">
        </a>
        <div aria-labelledby="dropdownMenuLink" class="dropdown-menu mt-3" style="width: 250px"
            disabled>
            <table style="width:100%">
                <tr style="border-bottom: 1px solid #eee">
                    <td class="text-center">
                        <img src="${user.avatar}" class="rounded-circle m-2"
                            style="object-fit: cover; display: inline;" width="40" height="40">
                    </td>
                    <td colspan="2">
                        <a href="/profile">
                            <div class="profile-group" style="display: inline;">
                                <p class="no-sp inlineblock">${user.nama}</p>
                                <p class="no-sp " style="font-size: 12px;">lihat profile</p>
                            </div>
                        </a>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <a href="#" class="btn btn-nav text-left" style="width:100%;">
                            <div class="profile-group">
                                <p class="no-sp inlineblock">Pengaturan & Privasi</p>
                            </div>
                        </a>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <a href="#" class="btn btn-nav text-left" style="width:100%;">
                            <div class="profile-group">
                                <p class="no-sp inlineblock">Wishlist</p>
                            </div>
                        </a>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <a href="#" class="btn btn-nav text-left" style="width:100%;">
                            <div class="profile-group">
                                <p class="no-sp inlineblock">Foodlist</p>
                            </div>
                        </a>
                        
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <a href="#" class="btn btn-nav text-left" style="width:100%;">
                            <div class="profile-group">
                                <p class="no-sp inlineblock">Hubungi Kami</p>
                            </div>
                        </a>
                        
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <a href="javascript:void(0)" onclick="logout()" class="btn btn-nav text-left" style="width:100%;">
                            <div class="profile-group">
                                <p class="no-sp inlineblock">Keluar</p>
                            </div>
                        </a>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</li>`;
}

function checkUser() {
    const token = localStorage.getItem('token');
    const el = document.querySelector("#top-nav-auth");
    el.innerHTML = loadUnauthenticated()
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
        el.innerHTML = loadAuthenticated(res.data);
    }).catch(function(error){
        el.innerHTML = loadUnauthenticated()
    })
}

function logout() {
    localStorage.removeItem('token');
    window.location = "/";
}

checkUser();