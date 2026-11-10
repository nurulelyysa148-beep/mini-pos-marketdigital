
/* =====================================
   MINI POS - KASIR DIGITAL
   TEMA COKLAT SUSU DAN PUTIH
===================================== */

// DATA PRODUK
const produkAwal = [
    {
        id: 1,
        nama: "Nasi Goreng",
        harga: 15000,
        stok: 20,
        kategori: "Makanan",
        gambar: "https://images.unsplash.com/photo-1512058564366-18510be2db19"
    },
    {
        id: 2,
        nama: "Burger",
        harga: 18000,
        stok: 15,
        kategori: "Makanan",
        gambar: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
    },
    {
        id: 3,
        nama: "Pizza",
        harga: 25000,
        stok: 10,
        kategori: "Makanan",
        gambar: "https://images.unsplash.com/photo-1513104890138-7c749659a591"
    },
    {
        id: 4,
        nama: "Ayam Goreng",
        harga: 20000,
        stok: 15,
        kategori: "Makanan",
        gambar: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec"
    },
    {
        id: 5,
        nama: "Kentang Goreng",
        harga: 12000,
        stok: 20,
        kategori: "Makanan",
        gambar: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877"
    },
    {
        id: 6,
        nama: "Mie Goreng",
        harga: 15000,
        stok: 20,
        kategori: "Makanan",
        gambar: "https://images.unsplash.com/photo-1585032226651-759b368d7246"
    },
    {
        id: 7,
        nama: "Es Kopi",
        harga: 10000,
        stok: 25,
        kategori: "Minuman",
        gambar: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735"
    },
    {
        id: 8,
        nama: "Es Teh",
        harga: 5000,
        stok: 30,
        kategori: "Minuman",
        gambar: "https://images.unsplash.com/photo-1556679343-c7306c1976bc"
    },
    {
        id: 9,
        nama: "Jus Jeruk",
        harga: 8000,
        stok: 20,
        kategori: "Minuman",
        gambar: "https://images.unsplash.com/photo-1600271886742-f049cd451bba"
    }
];

// PENYIMPANAN DATA
function ambilData(key, dataAwal) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : dataAwal;
    } catch (error) {
        return dataAwal;
    }
}

let produk = ambilData("miniPOS_produk", produkAwal);
let keranjang = [];
let riwayat = ambilData("miniPOS_riwayat", []);

function simpanData() {
    localStorage.setItem("miniPOS_produk", JSON.stringify(produk));
    localStorage.setItem("miniPOS_riwayat", JSON.stringify(riwayat));
}

// FORMAT RUPIAH
function rupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(angka);
}

// MENGAMANKAN TEKS
function aman(teks) {
    return String(teks).replace(/[&<>"']/g, function (huruf) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[huruf];
    });
}

// TAMPILKAN PRODUK
function tampilkanProduk() {
    const daftar = document.getElementById("daftarProduk");

    const pencarian = document
        .getElementById("searchProduk")
        .value.toLowerCase();

    const kategori = document.getElementById("filterKategori").value;

    const hasil = produk.filter(item => {
        return item.nama.toLowerCase().includes(pencarian) &&
            (kategori === "Semua" || item.kategori === kategori);
    });

    if (hasil.length === 0) {
        daftar.innerHTML = `
            <div class="col-12 text-center py-4">
                <h6>Produk tidak ditemukan.</h6>
            </div>
        `;
        return;
    }

    daftar.innerHTML = hasil.map(item => `
        <div class="col-md-4 col-sm-6">
            <div class="product-card">

                <img
                    src="${aman(item.gambar)}"
                    class="product-img"
                    alt="${aman(item.nama)}"
                    onerror="this.onerror=null;this.src='https://placehold.co/400x250/F5EBDD/65452F?text=Gambar+Produk'">

                <div class="card-body">

                    <span class="badge text-bg-light mb-2">
                        ${aman(item.kategori)}
                    </span>

                    <h6 class="fw-bold">${aman(item.nama)}</h6>

                    <p class="mb-2 fw-bold" style="color:#A67C5B">
                        ${rupiah(item.harga)}
                    </p>

                    <p class="small text-muted">
                        Stok: ${item.stok}
                    </p>

                    <button
                        class="btn btn-primary btn-sm w-100"
                        onclick="tambahKeKeranjang(${item.id})"
                        ${item.stok <= 0 ? "disabled" : ""}>

                        <i class="bi bi-cart-plus"></i>
                        ${item.stok <= 0 ? "Stok Habis" : "Tambah ke Keranjang"}

                    </button>

                </div>
            </div>
        </div>
    `).join("");
}

// TAMBAH PRODUK
function tambahProduk() {
    const nama = prompt("Masukkan nama produk:");

    if (!nama || !nama.trim()) return;

    const harga = Number(prompt("Masukkan harga produk:"));

    if (!Number.isSafeInteger(harga) || harga <= 0) {
        alert("Harga harus berupa angka positif!");
        return;
    }

    const stok = Number(prompt("Masukkan jumlah stok:"));

    if (!Number.isSafeInteger(stok) || stok < 0) {
        alert("Stok harus berupa angka nol atau lebih!");
        return;
    }

    const kategori = prompt("Kategori Makanan atau Minuman:");

    if (!kategori) return;

    const kategoriBenar = kategori.trim().toLowerCase();

    if (!["makanan", "minuman"].includes(kategoriBenar)) {
        alert("Kategori tidak valid!");
        return;
    }

    const gambar = prompt("Masukkan link gambar produk:");

    if (!gambar || !/^https?:\/\//i.test(gambar.trim())) {
        alert("Link gambar tidak valid!");
        return;
    }

    const idBaru = produk.length
        ? Math.max(...produk.map(item => item.id)) + 1
        : 1;

    produk.push({
        id: idBaru,
        nama: nama.trim(),
        harga: harga,
        stok: stok,
        kategori: kategoriBenar === "makanan" ? "Makanan" : "Minuman",
        gambar: gambar.trim()
    });

    simpanData();
    tampilkanProduk();
    perbaruiDashboard();

    alert("Produk berhasil ditambahkan!");
}

// TAMBAH KE KERANJANG
function tambahKeKeranjang(id) {
    const item = produk.find(p => p.id === id);

    if (!item || item.stok <= 0) {
        alert("Stok produk habis!");
        return;
    }

    const ada = keranjang.find(p => p.id === id);

    if (ada) {
        if (ada.jumlah >= item.stok) {
            alert("Jumlah melebihi stok!");
            return;
        }

        ada.jumlah++;
    } else {
        keranjang.push({
            id: item.id,
            nama: item.nama,
            harga: item.harga,
            jumlah: 1
        });
    }

    tampilkanKeranjang();
}

// UBAH JUMLAH
function ubahJumlah(id, perubahan) {
    const item = keranjang.find(p => p.id === id);
    const dataProduk = produk.find(p => p.id === id);

    if (!item || !dataProduk) return;

    const jumlahBaru = item.jumlah + perubahan;

    if (jumlahBaru > dataProduk.stok) {
        alert("Jumlah melebihi stok tersedia!");
        return;
    }

    if (jumlahBaru <= 0) {
        keranjang = keranjang.filter(p => p.id !== id);
    } else {
        item.jumlah = jumlahBaru;
    }

    tampilkanKeranjang();
}

// HAPUS KERANJANG
function hapusKeranjang(id) {
    keranjang = keranjang.filter(item => item.id !== id);
    tampilkanKeranjang();
}

// HITUNG TOTAL
function hitungTotal() {
    return keranjang.reduce(
        (total, item) => total + item.harga * item.jumlah,
        0
    );
}

// TAMPILKAN KERANJANG
function tampilkanKeranjang() {
    const tempat = document.getElementById("keranjang");

    if (keranjang.length === 0) {
        tempat.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-cart3 fs-1"></i>
                <p class="mt-2">Keranjang masih kosong.</p>
            </div>
        `;
    } else {
        tempat.innerHTML = keranjang.map(item => `
            <div class="cart-item">

                <div class="d-flex justify-content-between align-items-center">

                    <div>
                        <strong>${aman(item.nama)}</strong>
                        <div class="small text-muted">
                            ${rupiah(item.harga)}
                        </div>
                    </div>

                    <button
                        class="btn btn-sm btn-outline-danger"
                        onclick="hapusKeranjang(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>

                </div>

                <div class="d-flex justify-content-between align-items-center mt-2">

                    <div>
                        <button
                            class="btn btn-sm btn-outline-secondary"
                            onclick="ubahJumlah(${item.id}, -1)">-</button>

                        <span class="mx-2">${item.jumlah}</span>

                        <button
                            class="btn btn-sm btn-outline-secondary"
                            onclick="ubahJumlah(${item.id}, 1)">+</button>
                    </div>

                    <strong>
                        ${rupiah(item.harga * item.jumlah)}
                    </strong>

                </div>

            </div>
        `).join("");
    }

    document.getElementById("totalBelanja").textContent =
        rupiah(hitungTotal());

    hitungKembalian();
}

// HITUNG KEMBALIAN
function hitungKembalian() {
    const metode = document.getElementById("metode").value;
    const bagianTunai = document.getElementById("bagianTunai");
    const status = document.getElementById("statusPembayaran");

    const total = hitungTotal();
    const uang = Number(document.getElementById("uangBayar").value) || 0;

    if (metode === "Tunai") {
        bagianTunai.style.display = "block";

        const kembali = uang - total;

        document.getElementById("kembalian").textContent =
            rupiah(Math.max(0, kembali));

        if (uang < total && uang > 0) {
            status.textContent = "Uang pembayaran belum cukup.";
            status.className = "small text-danger";
        } else {
            status.textContent = "";
        }
    } else {
        bagianTunai.style.display = "none";
        document.getElementById("kembalian").textContent = "Rp0";
        status.textContent = "";
    }
}

// PROSES TRANSAKSI TANPA PRINT
function prosesTransaksi() {
    if (keranjang.length === 0) {
        alert("Keranjang masih kosong!");
        return;
    }

    const total = hitungTotal();
    const metode = document.getElementById("metode").value;
    const uang = Number(document.getElementById("uangBayar").value) || 0;

    if (metode === "Tunai" && uang < total) {
        alert("Uang pembayaran tidak mencukupi!");
        return;
    }

    for (const item of keranjang) {
        const dataProduk = produk.find(p => p.id === item.id);

        if (!dataProduk || dataProduk.stok < item.jumlah) {
            alert("Stok " + item.nama + " tidak mencukupi!");
            return;
        }
    }

    const transaksi = {
        id: Date.now(),
        tanggal: new Date().toLocaleString("id-ID"),
        total: total,
        metode: metode,
        uang: metode === "Tunai" ? uang : 0,
        items: keranjang.map(item => ({ ...item }))
    };

    // KURANGI STOK
    keranjang.forEach(item => {
        const dataProduk = produk.find(p => p.id === item.id);
        dataProduk.stok -= item.jumlah;
    });

    // SIMPAN TRANSAKSI
    riwayat.push(transaksi);
    simpanData();

    // TAMPILKAN NOTA
    buatNota(transaksi);

    // KOSONGKAN KERANJANG
    keranjang = [];

    document.getElementById("uangBayar").value = "";
    document.getElementById("statusPembayaran").textContent = "";

    // PERBARUI TAMPILAN
    tampilkanKeranjang();
    tampilkanProduk();
    tampilkanRiwayat();
    perbaruiDashboard();

    // NOTA LANGSUNG MUNCUL
    const receipt = document.getElementById("receipt");
    receipt.style.display = "block";

    receipt.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// BUAT NOTA LANGSUNG DI HALAMAN
function buatNota(transaksi) {
    const receipt = document.getElementById("receipt");

    const kembali = transaksi.metode === "Tunai"
        ? transaksi.uang - transaksi.total
        : 0;

    receipt.innerHTML = `
        <div class="section-card">

            <div class="text-center">

                <div class="metric-icon mx-auto">
                    <i class="bi bi-check-circle"></i>
                </div>

                <h4 style="color:#65452F">
                    Transaksi Berhasil!
                </h4>

                <p class="text-muted">
                    Pembayaran berhasil disimpan.
                </p>

                <hr>

                <h3 style="color:#65452F">
                    <i class="bi bi-shop"></i> MINI POS
                </h3>

                <p>Struk Pembayaran</p>

            </div>

            <hr>

            <p>
                <strong>Tanggal:</strong>
                ${aman(transaksi.tanggal)}
            </p>

            <p>
                <strong>Metode:</strong>
                ${aman(transaksi.metode)}
            </p>

            <hr>

            <h6 class="fw-bold mb-3">Detail Pembelian</h6>

            ${transaksi.items.map(item => `
                <div class="d-flex justify-content-between mb-3">
                    <span>
                        ${aman(item.nama)} x ${item.jumlah}
                    </span>

                    <strong>
                        ${rupiah(item.harga * item.jumlah)}
                    </strong>
                </div>
            `).join("")}

            <hr>

            <div class="d-flex justify-content-between">
                <strong>Total Belanja</strong>
                <strong style="color:#65452F">
                    ${rupiah(transaksi.total)}
                </strong>
            </div>

            ${transaksi.metode === "Tunai" ? `
                <div class="d-flex justify-content-between mt-2">
                    <span>Uang Bayar</span>
                    <span>${rupiah(transaksi.uang)}</span>
                </div>

                <div class="d-flex justify-content-between mt-2">
                    <span>Kembalian</span>
                    <strong>${rupiah(kembali)}</strong>
                </div>
            ` : ""}

            <hr>

            <h6 class="text-center">
                Terima kasih telah berbelanja!
            </h6>

            <div class="d-flex gap-2 mt-4">

                <button
                    class="btn btn-primary w-100"
                    onclick="document.getElementById('receipt').style.display='none'">

                    <i class="bi bi-x-circle"></i>
                    Tutup Nota

                </button>

            </div>

        </div>
    `;
}

// TAMPILKAN RIWAYAT
function tampilkanRiwayat() {
    const tempat = document.getElementById("daftarRiwayat");

    if (riwayat.length === 0) {
        tempat.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    Belum ada transaksi.
                </td>
            </tr>
        `;
        return;
    }

    tempat.innerHTML = [...riwayat].reverse().map((item, index) => `
        <tr>
            <td>${riwayat.length - index}</td>
            <td>${aman(item.tanggal)}</td>
            <td>${rupiah(item.total)}</td>
            <td>${aman(item.metode)}</td>
        </tr>
    `).join("");
}

// PERBARUI DASHBOARD
function perbaruiDashboard() {
    const hariIni = new Date().toLocaleDateString("id-ID");

    const transaksiHariIni = riwayat.filter(item => {
        return new Date(item.id).toLocaleDateString("id-ID") === hariIni;
    });

    const omzet = transaksiHariIni.reduce(
        (total, item) => total + item.total, 0
    );

    const totalStok = produk.reduce(
        (total, item) => total + item.stok, 0
    );

    document.getElementById("omzet").textContent = rupiah(omzet);

    document.getElementById("totalStok").textContent = totalStok;

    document.getElementById("jumlahTransaksi").textContent =
        transaksiHariIni.length;
}

// JALANKAN APLIKASI
document.addEventListener("DOMContentLoaded", function () {
    tampilkanProduk();
    tampilkanKeranjang();
    tampilkanRiwayat();
    perbaruiDashboard();
});
