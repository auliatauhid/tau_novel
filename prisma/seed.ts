import { PrismaClient, Role, NovelStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Taunovel database...');

  // 1. Clean existing data
  await prisma.readingProgress.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.novelView.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.novelGenre.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.novel.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Admin & Users
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminRawPassword = process.env.ADMIN_PASSWORD || 'TaunovelAdminSecure2026!';
  const adminPassword = await bcrypt.hash(adminRawPassword, 10);
  const userPassword = await bcrypt.hash(process.env.SEED_USER_PASSWORD || 'ReaderSecure2026!', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Taunovel',
      email: adminEmail,
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'Budi Santoso',
      email: 'reader1@example.com',
      password: userPassword,
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Siti Nurhaliza',
      email: 'reader2@example.com',
      password: userPassword,
      role: Role.USER,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Rian Hidayat',
      email: 'reader3@example.com',
      password: userPassword,
      role: Role.USER,
    },
  });

  console.log('Seed users created successfully.');

  // 3. Create Genres
  const genreData = [
    { name: 'Fantasy', slug: 'fantasy' },
    { name: 'Romance', slug: 'romance' },
    { name: 'Action', slug: 'action' },
    { name: 'Adventure', slug: 'adventure' },
    { name: 'Drama', slug: 'drama' },
    { name: 'Sci-Fi', slug: 'sci-fi' },
    { name: 'Mystery', slug: 'mystery' },
    { name: 'Slice of Life', slug: 'slice-of-life' },
  ];

  const genres: Record<string, string> = {};
  for (const g of genreData) {
    const created = await prisma.genre.create({ data: g });
    genres[g.slug] = created.id;
  }
  console.log('Genres created:', Object.keys(genres).length);

  // Helper for sample covers
  const covers = [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
  ];

  // 4. Create Novels and Chapters
  const novelsToSeed = [
    {
      title: 'Legenda Pedang Bintang',
      slug: 'legenda-pedang-bintang',
      author: 'Aria Wijaya',
      description: 'Kisah petualangan seorang pemuda pedesaan bernama Rey yang secara tak sengaja menemukan Pedang Bintang di sebuah gua purba. Senjata legendaris ini memendam kekuatan langit yang diincar oleh para dewa dan iblis.',
      coverUrl: covers[0],
      language: 'Indonesia',
      status: NovelStatus.ONGOING,
      published: true,
      genres: ['fantasy', 'action', 'adventure'],
      chapters: [
        { chapterNumber: 1, title: 'Penemuan Di Gua Purba', content: '<p>Malam menyelimuti Desa Lembah Hijau dengan kabut tebal. Rey berjalan menembus semak-semak rimba dengan obor kecil di tangannya.</p><p>Ia melangkah mendekati mulut gua purba yang konon dihuni oleh makhluk-makhluk astral. Di tengah kegelapan gua, sebuah pendaran cahaya biru misterioso berkilau di atas altar batu.</p><p><strong>"Apakah ini... Pedang Bintang?"</strong> bisik Rey terpana.</p>' },
        { chapterNumber: 2, title: 'Kekuatan Yang Terbangun', content: '<p>Saat jemari Rey menyentuh gagang pedang bertatahkan permata langit itu, sebuah gelombang energi dahsyat menghentak dadanya.</p><p>Penglihatan kuno berputar di kepalanya. Pertempuran ribuan tahun lalu antara Bangsa Bintang dan Raja Kegelapan terlintas dengan sangat jelas.</p><p>Segel kuno pedang itu kini telah patah.</p>' },
        { chapterNumber: 3, title: 'Kejar-Kejaran Di Hutan Bayangan', content: '<p>Pancaran energi dari terbongkarnya segel tak luput dari pengawasan para prajurit Istana Kegelapan. Suara derap langkah kuda berarmor besi bergema dari jauh.</p><p>Rey harus berlari secepat mungkin menembus Hutan Bayangan sebelum para musuh mengepung desa kelahirannya.</p>' },
        { chapterNumber: 4, title: 'Pertemuan Dengan Sang Mentor', content: '<p>Terdesak di tebing terjal, Rey berhadapan dengan tiga prajurit berbaju zirah hitam. Namun tiba-tiba, seberkas kilatan angin menumbangkan para musuh.</p><p>Seorang lelaki tua berambut perak dengan jubah kelabu berdiri santai di balik pepohonan. <em>"Keterampilan pedangmu sangat kasar, Anak Muda,"</em> ujarnya terkekeh.</p>' },
        { chapterNumber: 5, title: 'Gerbang Akademi Cahaya', content: '<p>Lelaki tua itu memperkenalkan dirinya sebagai Master Ken. Ia mengajak Rey menuju Kota Kerajaan untuk mendaftar di Akademi Cahaya.</p><p>Inilah awal mula perjalanan Rey yang sesungguhnya untuk menguasai jurus Pedang Bintang Tujuh.</p>' },
      ],
    },
    {
      title: 'Takdir Cinta Di Ujung Senja',
      slug: 'takdir-cinta-di-ujung-senja',
      author: 'Siti Rahmawati',
      description: 'Ketika dua hati yang terpisah oleh perbedaan status dan rahasia masa lalu kembali dipertemukan di sudut sebuah kafe tua saat senja menyapa.',
      coverUrl: covers[1],
      language: 'Indonesia',
      status: NovelStatus.COMPLETED,
      published: true,
      genres: ['romance', 'drama', 'slice-of-life'],
      chapters: [
        { chapterNumber: 1, title: 'Pertemuan Pertama Di Kafe Senja', content: '<p>Hujan gerimis membendung jalanan Kota Bandung. Kirana menatap cangkir kopi kapucino hangat yang mengepul di meja kayu tua.</p><p>Dentang bel pintu berdenting. Seorang pria berjaket kulit basah melangkah masuk. Pandangan mereka bertemu, dan waktu seolah berhenti seketika.</p>' },
        { chapterNumber: 2, title: 'Janji Yang Terlupakan', content: '<p>Gibran duduk tepat di hadapan Kirana. Lima tahun telah berlalu sejak kepergiannya tanpa pamit ke negeri jiran.</p><p><em>"Aku tidak pernah melupakan janjiku, Kirana,"</em> bisik Gibran lembut dengan mata yang dipenuhi penyesalan.</p>' },
        { chapterNumber: 3, title: 'Bayangan Masa Lalu', content: '<p>Kirana mencoba mengeraskan hatinya. Luka lama tidak mudah disembuhkan begitu saja hanya dengan sebaris kata maaf.</p><p>Ia mengingat hari-hari sepi di mana ia berjuang menyelesaikan studinya sendirian tanpa kabar dari pria itu.</p>' },
        { chapterNumber: 4, title: 'Surat-Surat Yang Tak Terkirim', content: '<p>Suatu sore, Gibran menyerahkan sebuah kotak kayu berukir. Di dalamnya berisi puluhan surat yang ditulis Gibran setiap malam saat ia berjuang melawan sakit keras di rumah sakit.</p><p>Air mata Kirana menetes membaca setiap lembar kejujuran hati Gibran.</p>' },
        { chapterNumber: 5, title: 'Mentari Di Ujung Senja', content: '<p>Di bawah sinar senja yang jingga keemasan, mereka berjanji untuk menyongsong hari esok bersama tanpa rasa takut lagi.</p><p>Cinta sejati selalu menemukan jalannya untuk pulang.</p>' },
      ],
    },
    {
      title: 'Penyihir Terakhir di Akademi Sihir',
      slug: 'penyihir-terakhir-di-akademi-sihir',
      author: 'Dian Pratama',
      description: 'Di era di mana teknologi menggantikan sihir kuno, Zephyr menjadi murid terakhir yang memiliki keahlian mengendalikan empat elemen murni.',
      coverUrl: covers[2],
      language: 'Indonesia',
      status: NovelStatus.ONGOING,
      published: true,
      genres: ['fantasy', 'sci-fi', 'adventure'],
      chapters: [
        { chapterNumber: 1, title: 'Ujian Masuk Akademi Aether', content: '<p>Akademi Aether berdiri megah dengan menara-menara kaca setinggi awan. Semua calon siswa mengandalkan perangkat mekanik magis terbaru.</p><p>Zephyr maju ke panggung pengujian hanya membawa sebuah tongkat kayu tua tanpa kristal bantuan.</p>' },
        { chapterNumber: 2, title: 'Elemen Yang Tak Terduga', content: '<p>Ketika penguji menguji kapasitas energi Zephyr, bola pengukur menggelegar dan pecah berkeping-keping.</p><p>Api, air, angin, dan tanah berputar membentuk aura spiral raksasa di sekeliling Zephyr.</p>' },
        { chapterNumber: 3, title: 'Persaingan Kelas S', content: '<p>Keberhasilan Zephyr menempatkannya di Kelas S bersama para bangsawan berkekuatan mekanik tinggi.</p><p>Banyak siswa yang merasa iri dan mencoba memprovokasi Zephyr dalam pertarungan simulasi.</p>' },
        { chapterNumber: 4, title: 'Ancaman Dari Kegelapan Cyber', content: '<p>Sistem keamanan akademi tiba-tiba diretas oleh jaringan kelompok radikal yang ingin memusnahkan sisa-sisa penyihir tradisional.</p><p>Zephyr harus mengandalkan insting sihir murninya untuk menyelamatkan rekan-rekan sekelasnya.</p>' },
        { chapterNumber: 5, title: 'Rahasia Darah Murni', content: '<p>Kepala Sekolah memanggil Zephyr ke ruang rahasia. Di sana terungkap identitas asli orang tua Zephyr yang merupakan pelindung kuno benua ini.</p>' },
      ],
    },
    {
      title: 'Bayangan Kaisar Langit',
      slug: 'bayangan-kaisar-langit',
      author: 'Hadi Santoso',
      description: 'Perjalanan kultivasi menembus batas langit demi membalaskan dendam sekte yang dibantai dan merebut kembali tahta Kaisar yang terampas.',
      coverUrl: covers[3],
      language: 'Indonesia',
      status: NovelStatus.COMPLETED,
      published: true,
      genres: ['action', 'fantasy'],
      chapters: [
        { chapterNumber: 1, title: 'Hancurnya Sekte Awan Putih', content: '<p>Api membumbung tinggi membakar puncak Gunung Awan Putih. Lin Tian menyaksikan sektenya rata dengan tanah.</p><p>Dengan sisa tenaga, Lin Tian menelan Kitab Naga Naga Hitam dan melompat ke dalam jurang kematian.</p>' },
        { chapterNumber: 2, title: 'Kultivasi Di Jurang Kematian', content: '<p>Tiga tahun Lin Tian bertapa di dasar jurang yang penuh dengan racun dan binatang buas purba.</p><p>Tubuhnya ditempa menjadi kebal racun dan meridian darah naganya berhasil terbuka sempurna.</p>' },
        { chapterNumber: 3, title: 'Kembali Ke Dunia Manusia', content: '<p>Lin Tian menyamarkan namanya menjadi Xiao Chen dan turun gunung menghadiri Lelang Kota Kekaisaran.</p><p>Ia membeli rumput pemurni jiwa untuk menyembuhkan luka dalamnya.</p>' },
        { chapterNumber: 4, title: 'Lembah Binatang Suci', content: '<p>Demi mencari batu inti naga, Lin Tian menjelajahi Lembah Binatang Suci dan bertarung melawan Harimau Bersayap Emas.</p>' },
        { chapterNumber: 5, title: 'Puncak Pertarungan Sekte', content: '<p>Lin Tian menantang Pemimpin Sekte Iblis di puncak Gunung Naga. Pembantaian masa lalu akhirnya terbalaskan dengan tuntas.</p>' },
      ],
    },
    {
      title: 'Detektif Kota Mistik',
      slug: 'detektif-kota-mistik',
      author: 'Rian Hidayat',
      description: 'Kisah Detektif Aris yang memecahkan kasus-kasus pembunuhan aneh yang melibatkan kekuatan gaib dan ritual kuno di kota modern Jakarta.',
      coverUrl: covers[4],
      language: 'Indonesia',
      status: NovelStatus.HIATUS,
      published: true,
      genres: ['mystery', 'fantasy', 'drama'],
      chapters: [
        { chapterNumber: 1, title: 'Mayat Di Gedung Tua', content: '<p>Jam menunjukkan pukul 02.00 dini hari. Garis polisi terpasang memutari lantai lima gedung terbengkalai di kawasan Cikini.</p><p>Detektif Aris menyalakan rokoknya sambil mengamati simbol bintang segi lima yang digambar menggunakan darah di dinding.</p>' },
        { chapterNumber: 2, title: 'Mata Batin Sang Detektif', content: '<p>Sejak kecil, Aris memiliki kemampuan melihat aura jejak energi yang ditinggalkan oleh pelaku supranatural.</p><p>Dari jejak darah itu, ia melihat pendaran aura merah milik klan siluman serigala.</p>' },
        { chapterNumber: 3, title: 'Informan Pasar Gaib', content: '<p>Aris mendatangi lorong rahasia di bawah Pasar Senen yang menghubungkan kota manusia dengan Pasar Gaib Nokturnal.</p><p>Ia menemui Mbah Suro untuk menggali informasi tentang pemesan ritual bintang darah.</p>' },
        { chapterNumber: 4, title: 'Jebakan Di Pelabuhan', content: '<p>Penyelidikan mengarah pada sebuah kontainer mencurigakan di Pelabuhan Tanjung Priok. Saat Aris membuka kontainer, puluhan boneka santet hidup menyerangnya.</p>' },
        { chapterNumber: 5, title: 'Dalang Di Balik Layar', content: '<p>Sebuah surat bertinta emas ditemukan di saku korban. Nama pejabat tinggi kota tertera sebagai pemesan ritual abadi.</p>' },
      ],
    },
  ];

  for (const n of novelsToSeed) {
    const novel = await prisma.novel.create({
      data: {
        title: n.title,
        slug: n.slug,
        author: n.author,
        description: n.description,
        coverUrl: n.coverUrl,
        language: n.language,
        status: n.status,
        published: n.published,
        genres: {
          create: n.genres.map((gSlug) => ({
            genre: { connect: { id: genres[gSlug] } },
          })),
        },
        chapters: {
          create: n.chapters.map((ch) => ({
            chapterNumber: ch.chapterNumber,
            title: ch.title,
            content: ch.content,
            published: true,
          })),
        },
      },
    });

    // Seed views
    await prisma.novelView.createMany({
      data: [
        { novelId: novel.id, userId: user1.id },
        { novelId: novel.id, userId: user2.id },
        { novelId: novel.id, userId: user3.id },
        { novelId: novel.id },
        { novelId: novel.id },
      ],
    });

    console.log(`Seeded novel: "${novel.title}" with ${n.chapters.length} chapters.`);
  }

  // Seed sample Bookmark & Reading Progress for user1
  const firstNovel = await prisma.novel.findFirst({ where: { slug: 'legenda-pedang-bintang' }, include: { chapters: true } });
  if (firstNovel) {
    await prisma.bookmark.create({
      data: {
        userId: user1.id,
        novelId: firstNovel.id,
      },
    });

    const ch2 = firstNovel.chapters.find((c) => c.chapterNumber === 2);
    if (ch2) {
      await prisma.readingProgress.create({
        data: {
          userId: user1.id,
          novelId: firstNovel.id,
          chapterId: ch2.id,
          progress: 65,
        },
      });
    }
  }

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
