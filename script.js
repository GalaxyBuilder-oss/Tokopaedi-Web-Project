// pendeklarasian favicon agar di setiap halaman html sama
const favicon = document.createElement('link')
favicon.rel="shortcut icon"
favicon.href="favicon.ico"
favicon.type="image/x-tipe"
document.head.appendChild(favicon)

// link API yang digunakan
// Credit And Docs Visit https://fakestoreapi.com/docs
const categoryAPI = 'https://fakestoreapi.com/products/categories'
const productAPI = 'https://fakestoreapi.com/products'

//Link halaman
const mainPage = './index.html'
const DetailPage = './detail.html'
let currPage = window.location.href

// function untuk memunculkan bottom dialog
function showModal(selector, trigger, header, body, footer) {
    //pendeklaran variabel
    const mainLayout = document.querySelector(selector)
    const modalLayout = document.createElement('div')
    const modalContent = document.createElement('div')
    const modalHeader = document.createElement('div')
    const modalHeaderText = document.createElement('h2')
    const modalClose = document.createElement('span')
    const modalCloseI = document.createElement('i')
    const modalBody = document.createElement('div')
    const modalFooter = document.createElement('div')
    const modalFooterText = document.createElement('h3')
    const chekoutButton = document.createElement('button')

    // Modifikasi Elemen
    modalLayout.classList.add('modal')
    modalContent.classList.add('modal-content')
    modalHeader.classList.add('modal-header')
    modalHeaderText.classList.add('title-title')
    modalClose.classList.add('close')
    modalCloseI.classList.add('material-icons')
    modalBody.classList.add('modal-body')
    modalFooter.classList.add('modal-footer')
    modalFooterText.classList.add('price-total')
    chekoutButton.innerText='Confirm'
    modalCloseI.innerText='close'
    modalHeaderText.innerText=header
    modalBody.innerText=body
    modalFooterText.innerText=footer

    // Menambahkan event ke tag
    modalClose.addEventListener("click",() => {
        let i = confirm("Anda Ingin Membatalkan Proses Saat Ini?")
        if (i) modalLayout.classList.remove('modal-open')
    })
    trigger.addEventListener("click",() => {
        modalLayout.classList.add('modal-open')
    })
    window.addEventListener('click', (event) => {
        if (event.target == modalLayout) {
          let i = confirm("Anda Ingin Membatalkan Proses Saat Ini?")
          if (i) modalLayout.classList.remove('modal-open')
        }
      })
    chekoutButton.addEventListener('click',()=> {
        if (localStorage.getItem('user')=='true') {
            modalLayout.classList.remove('modal-open')
            alert('Done, Youre Will Be Redirected To Main Page')
            setTimeout(()=>{
                location.href='./index.html'
            },1300)
        } else {
            alert('You Must Login Before To Puchase Item')
            modalLayout.classList.remove('modal-open')
            setTimeout(()=>{
                location.href='./index.html'
            },1300)
        }
})

    // append tag ke html
    modalClose.appendChild(modalCloseI)
    modalHeader.append(modalClose, modalHeaderText)
    modalContent.append(modalHeader, modalBody, modalFooter)
    modalFooter.append(modalFooterText, chekoutButton)
    modalLayout.appendChild(modalContent)
    mainLayout.appendChild(modalLayout)
}

// fungsi utama untuk mengambil dan menampilkan data dari API
async function init() {
    loader()
    if (!currPage.includes('/detail.html')) {
        // fetch data dari api ke json
        // await berfungsi agar ketika pemanggilan API nya di beri jeda ketika di panggil secara berulang
        // dan tidak membebankan server
        const [products, categories] = await Promise.all([
            fetch(productAPI).then(res => res.json()),
            fetch(categoryAPI).then(res1 => res1.json())
        ])
        const footerLink = document.querySelector('.container-footer .testa')
        const currYear = new Date().getFullYear()
        footerLink.innerText=`Tokopaedi © ${currYear} - All Rights Reserved`

        // pendeklarasian variabel konstanta untuk tag di html
        const containerMain = document.querySelector('.container-main')
        const containerHeader = document.getElementById("container-header")
        const articleSection = document.querySelector('.article-section')
        const toTopButton = document.createElement('a')
        const toTopButtonLogo = document.createElement('i')
        const siteLogo = document.getElementById("logo")
        const navMenu = document.querySelector('.nav-head ul')
        const asideMenu = document.querySelector('.aside-menu ul')
        const menuButton = document.querySelector('.button')

        // menambahkan attribut ke toTopButton
        toTopButton.href='#top'
        toTopButton.classList.add('to-top')
        toTopButtonLogo.classList.add('material-icons')
        toTopButtonLogo.innerText='arrow_upward'
        toTopButton.appendChild(toTopButtonLogo)

        // menampilkan popup menu profile
        const buttonLogin = document.querySelector('.button-login')
        if (localStorage.getItem('user')=='true'){
            const cartGo = document.querySelector('.goto-cart')
            const profileGo = document.querySelector('.goto-profile')
            const logoutGo = document.querySelector('.goto-logout')
            cartGo.addEventListener('click',()=>{
                let i = JSON.parse(localStorage.getItem('userdata'))
                alert(`You Have ${i[parseInt(localStorage.getItem('user_id'))].cart} Goods in Cart!`)
            })
            profileGo.addEventListener('click',()=>{
                location.href='./profile.html'
            })
            logoutGo.addEventListener('click',()=>{
                localStorage.removeItem('user')
                localStorage.removeItem('user_id')
                location.reload()
            })
            buttonLogin.addEventListener('click',()=>{
                document.querySelector('.popup-profile-hide').classList.toggle('popup-profile-show')
            })
        } else {
            document.querySelector('.button-login>i').innerText='person_off'
            buttonLogin.addEventListener('click',()=>{
                localStorage.setItem('user',false)
                location.href='./signup-login.html'
            })
        }

        // mengubah position header menjadi sticky ketika di scroll kebawah
        window.onscroll = () => {
          if (document.documentElement.scrollTop > 70) {
                containerHeader.classList.add("sticky-header")
                if (document.querySelector('.to-top') == undefined) document.body.appendChild(toTopButton)
                siteLogo.src='./assets/logo-dark.png'
            } else {
                containerHeader.classList.remove("sticky-header")
                toTopButton.remove()
                siteLogo.src='./assets/logo-light.png'
            }
        }
        // menambahkan fungsi ke tombol untuk show/hide menu ketika di klik
        //*hanya berlaku untuk tampilan mobile
        menuButton.addEventListener('click',()=>{
            containerMain.classList.toggle('show-menu')
        })

        // penambahan produk dan menampilkannya di html
        let tokopaedi = {
            addCategoryToNav: (category, index)=> { // menambahkan nama kategori ke nav header dan aside(untuk tampilan mobile)
                const productSection = document.createElement('div')
                const categoryTitle = document.createElement('h1')
                const contentSection = document.createElement('div')
                const liNav = document.createElement('li')
                const aNav = document.createElement('a')
                aNav.innerText = category
                aNav.href=`#k${index}`
                liNav.appendChild(aNav)
                navMenu.appendChild(liNav)

                const liAside = document.createElement('li')
                const aAside = document.createElement('a')
                aAside.innerText = category
                aAside.href=`#k${index}`
                liAside.appendChild(aAside)
                asideMenu.appendChild(liAside)

                categoryTitle.innerText = category
                categoryTitle.id=`k${index}`
                contentSection.classList.add('content-list')
                contentSection.classList.add(`p${index}`)
                productSection.classList.add('products-section')
                productSection.appendChild(categoryTitle)
                productSection.appendChild(contentSection)
                articleSection.appendChild(productSection)
            },
            addProductToContent: (category, index) => { // menampilkan produk dan mengelompokkanya sesuai kategori masing-masing
                let theProduct={
                    image:'',
                    title:'',
                    description:'',
                    price:'',
                    rating: {
                        count:'',
                        rate:''
                    }
                }
                products.map((product)=> {
                    if (product.category == category) {
                        const layoutProduct = document.createElement('figure')
                        const imageProduct = document.createElement('img')
                        const titleProduct = document.createElement('figcaption')
                        const priceProduct = document.createElement('div')

                        layoutProduct.addEventListener("click", ()=> {
                            theProduct.image=product.image
                            theProduct.title=product.title
                            theProduct.description=product.description
                            theProduct.price=product.price
                            theProduct.rating.rate=product.rating.rate
                            theProduct.rating.count=product.rating.count
                            localStorage.setItem('product',JSON.stringify(theProduct))
                            localStorage.setItem('isCheckDetails?', true)
                            location.href=DetailPage
                        })

                        // memodifikasi elemen
                        imageProduct.src=product.image
                        titleProduct.innerText=product.title
                        priceProduct.innerText = `Price US$${product.price}`
                        const iconPrice = document.createElement('span')
                        iconPrice.setAttribute('class','material-icons')
                        iconPrice.innerText='sell'

                        // memasukkan elemen yang di buat dengan html
                        priceProduct.appendChild(iconPrice)
                        layoutProduct.appendChild(imageProduct)
                        layoutProduct.appendChild(titleProduct);
                        layoutProduct.appendChild(priceProduct);
                        document.querySelector(`.p${index}`).appendChild(layoutProduct)
                    }
                })
            }
        }
        // memanggil data data dari API untuk di tampilkan
        categories.map((category, index) => {
            tokopaedi.addCategoryToNav(category, index)
            tokopaedi.addProductToContent(category, index)
        })
    }
}

//fungsi untuk menampilkan detail dari produk yang dipilih, yang akan di tampilkan di detail.html
async function produkDetails() {

    loader()
    let userdata = JSON.parse(localStorage.getItem('userdata'))
    const product = JSON.parse(localStorage.getItem('product'))
    const pImage = document.querySelector('img')
    const productTitle = document.querySelector('.product-title')
    const productDesc = document.querySelector('.product-desc')
    const productPrice = document.querySelector('.price-is')
    const buyButton = document.querySelector('.buy-now')
    const addCartButton = document.querySelector('.add-cart')
    const notifIcon = document.createElement('span')
    const productRates = document.querySelector('.product-rates')
    const backButton = document.querySelector('.button-back')
    notifIcon.className='notification-cart-icon'
    backButton.addEventListener('click',()=> {
        history.back()
    })
    if (userdata.cart != null) {
        notifIcon.textContent=parseInt(userdata.cart)
        notifIcon.classList.add('show-count')
    } else {
        userdata.cart=0
        localStorage.setItem('userdata',JSON.stringify(userdata))
    }
    addCartButton.addEventListener('click',()=>{
        userdata.cart++
        notifIcon.innerText=userdata.cart
        notifIcon.classList.add('show-count')
        localStorage.setItem('userdata',JSON.stringify(userdata))
    })

    // Modikasi elemen
    document.querySelector('.button-layout').appendChild(notifIcon)
    showModal('section', buyButton, product.title, product.description, `US$${product.price}`)
    const countRate = document.createElement('span')
    const peopleRate = document.createElement('span')
    peopleRate.classList.add('material-icons')
    pImage.src=product.image
    pImage.alt=product.title
    productTitle.innerText=product.title
    productDesc.innerText=product.description
    productPrice.innerText = `Price US$${product.price}`
    buyButton.innerText='Buy Now'
    addCartButton.innerText='Add To Cart'
    productRates.innerText=`${product.rating.rate} -`

    for (let i=0; i<5;i++) {
        const productRate = document.createElement('span')
        productRate.classList.add('material-icons')
        if (i < product.rating.rate) productRate.innerText = i < Math.floor(product.rating.rate) ? 'star' : 'star_half'
        else productRate.innerText='star_outlined'
        productRates.appendChild(productRate)
    }
    countRate.classList.add('count-rates')
    countRate.innerText=product.rating.count
    peopleRate.innerText='people'
    productRates.appendChild(countRate)
    productRates.appendChild(peopleRate)
}

// Fungsi buat login dan edit data
function user() {
    // change string data from local storage to array or object
    let userData = JSON.parse(localStorage.getItem('userdata')) != null ? JSON.parse(localStorage.getItem('userdata')) : {}
    const backHome = document.querySelector('.button-back-profile')

    if (localStorage.getItem('user')=='true' && currPage.includes('/profile.html')){
        const userLegend = document.querySelector('.user-legend')
        const name = document.querySelector('.name')
        const noAccount = document.querySelector('.no-account')
        const username = document.querySelector('.username')
        const email = document.querySelector('.email')
        const password = document.querySelector('.password')
        const showNoAccount = document.querySelector('.show-no-account')
        const showPassword = document.querySelector('.show-password')
        const editBtn = document.querySelector('.button-edit')
        const deleteBtn = document.querySelector('.button-delete')

        backHome.addEventListener('click',()=>{
            history.back()
        })
        userLegend.innerText=userData.fullName
        name.innerText=userData.fullName
        noAccount.innerText='********'
        username.innerText=userData.username
        email.innerText=userData.email
        password.innerText='******'
        showNoAccount.setAttribute('checked','')
        showPassword.setAttribute('checked','')
        showNoAccount.addEventListener('change',()=>{
            if (showNoAccount.checked) noAccount.innerText='********'
            else noAccount.innerText=userData.noAccount
        })
        showPassword.addEventListener('change',()=>{
            if (showPassword.checked) password.innerText='******'
            else password.innerText=userData.password
        })

        let editIsTrue=true
        const inputName = document.createElement('input')
        const inputNoAccount = document.createElement('input')
        const inputEmail = document.createElement('input')
        const inputPassword = document.createElement('input')
        editBtn.addEventListener('click',()=>{
            if (editIsTrue) {
                name.innerText=''
                noAccount.innerText=''
                email.innerText=''
                password.innerText=''

                inputName.value=userData.fullName
                inputNoAccount.value=userData.noAccount
                inputEmail.value=userData.email
                inputPassword.value=userData.password
                name.append(inputName)
                noAccount.append(inputNoAccount)
                email.append(inputEmail)
                password.append(inputPassword)
                editBtn.innerText='Save'
                editIsTrue=false
            } else {
                editBtn.innerText='Edit'
                userData.fullName= inputName.value,
                userData.noAccount= inputNoAccount.value.toString(),
                userData.username= username.innerText,
                userData.email= inputEmail.value,
                userData.password= inputPassword.value.toString()
                localStorage.setItem('userdata',JSON.stringify(userData))
                editIsTrue=true
                location.reload()
            }
        })
        deleteBtn.addEventListener('click',()=>{
            let i=confirm(`Are You Sure Want Delete ${userData.username} ?`)
            if (i) {
                localStorage.removeItem('userdata')
                localStorage.setItem('user',false)
                location.href=mainPage
            }
        })

    } else if (localStorage.getItem('user') == 'false' && currPage.includes('/signup-login.html')) {
        const titleForm = document.querySelector('.user-legend')
        const formField = document.querySelector('.form-normal')
        const labelText = document.querySelectorAll('label')
        const inputField = document.querySelectorAll('input')
        const nameField = document.querySelector('#nameid')
        const noField = document.querySelector('#noid')
        const userField = document.querySelector('#userid')
        const emailField = document.querySelector('#emailid')
        const passField = document.querySelector('#passid')
        const submitButton = document.querySelector('#submit')
        const createAccountText = document.querySelector('.form-signup')
        const createAccount = document.querySelector('span>a')
        createAccount.addEventListener('click',()=>{
            alert('After Click Please Refresh The Page')
        })
        backHome.addEventListener('click',()=>{
            location.href=mainPage
        })
        let account = {
            login : () => {
                titleForm.innerText='Login Form'
                labelText.forEach((label)=>{
                    if (label.htmlFor!='userid' && label.htmlFor!='passid')
                        label.classList.add('form-hide')
                })
                inputField.forEach((input)=>{
                    input.classList.add('form-hide')
                })
                userField.classList.remove('form-hide')
                passField.classList.remove('form-hide')
                submitButton.classList.remove('form-hide')
                formField.addEventListener('submit',()=>{
                    if (userField.value==userData.username && passField.value==userData.password) {
                        alert('login')
                        localStorage.setItem('user',true)
                        formField.action='./index.html'
                    } else if (userField.value!=userData.username){
                        alert('Wrong Username')
                    } else if (passField.value!=userData.password){
                        alert('Wrong Password')
                    }
                })
            },
            signup : () => {
                titleForm.innerText='Signup Form'
                submitButton.value='Sign Up'
                createAccountText.textContent='Have account? '
                createAccount.innerText='Login Here!'
                createAccountText.append(createAccount)
                createAccount.addEventListener('click',()=>{
                    location.href='./signup-login.html'
                })
                labelText.forEach((label)=>{
                    label.classList.remove('form-hide')
                })
                inputField.forEach((input)=>{
                    input.classList.remove('form-hide')
                })
                formField.addEventListener('submit',()=>{
                    if (nameField.value != '' && noField.value != '' && userField.value != '' && emailField.value != '' && passField.value != ''){
                        let userData1={
                            fullName:nameField.value,
                            noAccount:noField.value,
                            username:userField.value,
                            email:emailField.value,
                            password:passField.value
                        }
                        localStorage.setItem('userdata', JSON.stringify(userData1))
                        alert('Done')
                        formField.action='./signup-login.html'
                    } else {
                        alert(`Don't Leave The Field Empty`)
                        formField.action='./signup-login.html#signup'
                    }
                })
            }
        }
        if (currPage.includes('#signup')) {
            account.signup()
        } else {
            account.login()
        }
    }
}

const loader = () => {
    const loaderLayout = document.createElement('div')
    const loaderContent = document.createElement('img')
    const loadingBar = document.createElement('div')
    const loadingBarInside = document.createElement('div')
    loaderLayout.classList.add('loader')
    loaderContent.classList.add('loader-content')
    loadingBar.classList.add('loading')
    loadingBarInside.classList.add('loading-inside')

    loaderContent.src='./assets/logo-light.png'
    loaderLayout.appendChild(loadingBarInside)
    loaderLayout.appendChild(loadingBar)
    loaderLayout.appendChild(loaderContent)
    document.body.append(loaderLayout)
    setTimeout(()=>loaderLayout.remove(),4000)
}

// mengecek apakah isCheckDetails? berisi true atau false nya
// jika true, maka akan memanggil fungsi produkDetails()
// jika false dsb, maka akan memanggil fungsi init()
// secara default, fungsi init() akan otomatis di panggil jika pertama kali membuka halaman index.html
    if(localStorage.getItem('isCheckDetails?')=='true' && currPage.includes('/detail.html')) {
        produkDetails()
    } else if (currPage.includes('/profile.html') || currPage.includes('/signup-login.html')){
        user()
    } else if (currPage.includes('/detail.html')){
        alert('Halaman tidak bisa di akses. anda akan di alihkan ke menu utama')
        localStorage.setItem('isCheckDetails?', false)
        setTimeout(()=>location.href=mainPage, 3000)
    } else {
        setTimeout(()=>{
            localStorage.removeItem('product')
            localStorage.removeItem('isCheckDetails?')
        }, 1000)
        init()
    }
