import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right.mjs'
import BriefcaseBusiness from 'lucide-react/dist/esm/icons/briefcase-business.mjs'
import Check from 'lucide-react/dist/esm/icons/check.mjs'
import Clock from 'lucide-react/dist/esm/icons/clock.mjs'
import Globe2 from 'lucide-react/dist/esm/icons/globe-2.mjs'
import Home from 'lucide-react/dist/esm/icons/home.mjs'
import Info from 'lucide-react/dist/esm/icons/info.mjs'
import MapPin from 'lucide-react/dist/esm/icons/map-pin.mjs'
import Menu from 'lucide-react/dist/esm/icons/menu.mjs'
import Newspaper from 'lucide-react/dist/esm/icons/newspaper.mjs'
import PhoneCall from 'lucide-react/dist/esm/icons/phone-call.mjs'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import X from 'lucide-react/dist/esm/icons/x.mjs'
import './styles.css'

const brandName = 'HGL GEM'

const navIcons = {
  '/': Home,
  '/about': Info,
  '/services': BriefcaseBusiness,
  '/blog': Newspaper,
  '/contact': PhoneCall
}

const contactInfo = {
  fa: {
    address: 'مشهد، خیابان امام خمینی، سه راه دارایی، کوچه ثبت، برج بین المللی طلا و جواهر مرمر، طبقه ۷، واحد ۹',
    hours: 'بجز پنجشنبه، ۹:۳۰ تا ۲ ظهر و با هماهنگی ۴ تا ۶ عصر',
    phoneLabel: 'شماره تماس'
  },
  en: {
    address: 'Mashhad, Imam Khomeini Street, Darayi three-way, Sabt Alley, Marmar International Gold and Jewellery Tower, 7th floor, Unit 9',
    hours: 'Except Thursdays, 9:30 AM to 2:00 PM, and 4:00 PM to 6:00 PM by appointment',
    phoneLabel: 'Phone'
  },
  phones: [
    { label: '051-38114416', href: 'tel:+985138114416' },
    { label: '09153588482', href: 'tel:+989153588482' },
    { label: '09303588021', href: 'tel:+989303588021' }
  ]
}

const content = {
  fa: {
    langName: 'EN',
    altLocale: 'en',
    nav: [
      { label: 'صفحه‌اصلی', href: '/' },
      { label: 'درباره ما', href: '/about' },
      { label: 'خدمات', href: '/services' },
      { label: 'مقالات', href: '/blog' },
      { label: 'تماس با ما', href: '/contact' }
    ],
    ui: {
      search: 'جستجو',
      searchTitle: 'دنبال چه می‌گردید؟',
      searchText: 'جستجوی خدمات، اخبار و اطلاعات گوهرشناسی',
      searchTerm: 'عبارت جستجو',
      searchPlaceholder: 'عبارت مورد نظر را وارد کنید',
      verify: 'مشاهده گزارشات',
      verifyLabel: 'بررسی گزارش',
      verifyTitle: 'مشاهده گزارشات',
      verifyText: 'کد شناسنامه درج شده بر روی گزارش را وارد کنید',
      license: 'کد شناسنامه',
      licensePlaceholder: 'مثال: HGL-000000',
      close: 'بستن',
      menu: 'باز کردن منو',
      readArticle: 'خواندن مقاله',
      backToBlog: 'بازگشت به بلاگ'
    },
    hero: {
      label: 'صدور گواهی گوهرسنگ',
      title: 'صدور گواهی اصالت',
      text: 'یکی از خدمات ویژه ما، صدور گواهی اصالت  برای سنگ‌های قیمتی است که از طریق همین سایت قابل پیگیری و تأیید می‌باشد. با استفاده از تیم تخصصی و ابزارهای پیشرفته، اصالت و کیفیت سنگ‌ها بررسی می‌شود تا اعتماد شما در خرید و فروش این جواهرات گران‌بها تضمین شود',
      about: 'درباره ما',
      contact: 'تماس با ما'
    },
    why: {
      label: 'چرا ما',
      title: 'پشتوانه ای مطمئن برای شناخت و ارزیابی گوهرسنگ ها.',
      text: 'از آغاز پژوهش های ما در سال ۱۳۷۸ تا امروز، تجربه کارشناسی رسمی، آموزش گوهرشناسی، ابزارهای پیشرفته و صدور گواهی اصالت را کنار هم قرار داده ایم تا انتخاب و معامله سنگ های قیمتی با اطمینان بیشتری انجام شود.',
      points: [
        { title: 'بیش از ۲۰ سال تجربه', text: 'پژوهش و فعالیت تخصصی ما در حوزه سنگ های قیمتی از سال ۱۳۷۸ آغاز شده است.' },
        { title: 'کارشناس رسمی دادگستری', text: 'عضو کانون کارشناسان رسمی دادگستری در رشته طلا، جواهر و سنگ های قیمتی.' },
        { title: 'صدور گواهی اصالت', text: 'تیم تخصصی ما اصالت و کیفیت گوهرسنگ ها را پیش از صدور گواهی بررسی می کند.' },
        { title: 'آموزش بین‌المللی گوهرشناسی', text: 'دوره‌های تخصصی سنگ‌های رنگی، الماس و مروارید با مدرک معتبر فنی‌وحرفه‌ای و کد بین‌المللی.' }
      ]
    },
    aboutPreview: {
      label: 'درباره ما',
      title: 'درباره مجموعه ما',
      text: 'پژوهش های ما در حوزه سنگ های قیمتی از سال ۱۳۷۸ و در قالب یک پروژه دانشجویی در دانشگاه فردوسی مشهد آغاز شد. امروز با بیش از ۲۰ سال تجربه در کارشناسی، صدور گواهی اصالت و آموزش گوهرشناسی، متعهد به کیفیت، اصالت و صداقت در خدمات هستیم.',
      button: 'درباره ما'
    },
    members: {
      label: 'اعضا',
      title: 'تیم تخصصی ما',
      phone: 'تلفن',
      items: [
        {
          name: 'مهندس مرضیه خواجه یزدی',
          role: 'کارشناس ارشد زمین شناسی و گوهرشناسی',
          text: 'سرپرست تیم کارشناسی با بیش از ۲۰ سال سابقه در کارشناسی جواهرات، سنگ های قیمتی، صدور گواهی و آموزش گوهرسنگ ها.',
          phone: '09153588482'
        },
        {
          name: 'مهندس دلارام پیروز مهر',
          role: 'گوهرشناس و طراح جواهرات',
          text: 'فعال در حوزه گوهرشناسی و طراحی جواهرات با بیش از ۵ سال فعالیت حرفه ای در این حوزه.',
          phone: '09303588021'
        },
        {
          name: 'مهسا حسن زاده',
          role: 'کارشناس حقوق',
          text: 'فعال در تیم مشاوره حقوقی و کارشناسی و مسئول امور ارتباط با مشتریان.',
          phone: '09303588021'
        }
      ]
    },
    cta: {
      label: 'درخواست مشاوره',
      title: 'برای دریافت نظر کارشناسی آماده‌اید؟',
      text: 'برای صدور گواهی اصالت، کارشناسی رسمی، گزارش حقوقی، اطلاعات دوره های آموزشی یا مشاوره پیش از خرید و فروش سنگ های قیمتی با HGL GEM تماس بگیرید.',
      button: 'تماس با HGL GEM'
    },
    services: {
      label: 'خدمات',
      title: 'خدمات تخصصی گوهرسنگ، از ارزیابی تا آموزش.',
      pageTitle: 'کارشناسی، خدمات حقوقی و قضایی، آموزش و مشاوره تخصصی.',
      pageText: 'در HGL GEM خدمات کارشناسی و ارزیابی گوهرسنگ ها، صدور گواهی معتبر، گزارش های رسمی برای مراجع قضایی و اداری، دوره های تخصصی گوهرشناسی و مشاوره سرمایه گذاری در بازار گوهرسنگ ها ارائه می شود.',
      all: 'همه خدمات',
      items: [
        { title: 'خدمات کارشناسی', text: 'کارشناسی و ارزیابی تخصصی گوهرسنگ ها، ارائه گواهی معتبر شناسایی سنگ های قیمتی و مشاوره در خرید و فروش بر اساس تحلیل کارشناسی.', pill: 'کارشناسی' },
        { title: 'خدمات حقوقی و قضایی', text: 'کارشناسی رسمی دادگستری در حوزه سنگ های قیمتی، طلا و جواهرات، ارائه گزارش های رسمی برای مراجع قضایی و اداری و مشاوره در اختلافات مربوط به اصالت و ارزش گذاری گوهرسنگ ها.', pill: 'حقوقی' },
        { title: 'آموزش و دوره ها', text: 'آموزش مقدماتی و پیشرفته گوهرشناسی در حوزه سنگ های رنگی، الماس و مروارید؛ برگزاری کلاس های تخصصی با مجوز سازمان فنی و حرفه ای کشور و اعطای مدرک معتبر با کد بین المللی.', pill: 'آموزش' },
        { title: 'مشاوره تخصصی', text: 'مشاوره تخصصی برای سرمایه گذاری در بازار گوهرسنگ ها و انتخاب آگاهانه بر اساس شناخت اصالت، ارزش و ظرفیت خرید و فروش.', pill: 'مشاوره' }
      ]
    },
    news: {
      label: 'آخرین اخبار',
      title: 'تازه ترین یادداشت های گوهرشناسی.'
    },
    aboutPage: {
      label: 'درباره ما',
      title: 'درباره مجموعه ما',
      text: 'با بیش از ۲۰ سال تجربه در کارشناسی و آموزش سنگ های قیمتی، متعهد به کیفیت، اصالت و صداقت در خدمات هستیم.',
      paragraphs: [
        'آغاز پژوهش های ما در حوزه سنگ های قیمتی به سال ۱۳۷۸ بازمی گردد؛ زمانی که این مسیر در قالب یک پروژه دانشجویی در دانشگاه فردوسی مشهد آغاز شد. علاقه به زیبایی و ارزش های نهفته در این جواهرات طبیعی، مسیر حرفه ای ما را شکل داد. با تجربه ۲۰ سال در کارشناسی و آموزش سنگ های قیمتی، ما به عنوان یکی از پیشروان این صنعت شناخته شده ایم و همواره به کیفیت و اصالت سنگ ها متعهد بوده ایم.',
        'ما همچنین عضو کانون کارشناسان رسمی دادگستری در رشته طلا، جواهر و سنگ های قیمتی هستیم که تخصص و اعتبار ما را در این صنعت بیش از پیش تضمین می کند.',
        'در این سایت، تلاش می کنیم تا دانش و اطلاعات مفیدی را درباره سنگ های کمیاب و ارزشمند در اختیار شما قرار دهیم و با ارائه خدمات منحصر به فرد، نیازهای خاص شما را برآورده کنیم.',
        'یکی از خدمات ویژه ما، صدور گواهی اصالت (Certificate) برای سنگ های قیمتی است که از طریق همین سایت قابل پیگیری و تأیید می باشد. با استفاده از تیم تخصصی و ابزارهای پیشرفته، اصالت و کیفیت سنگ ها بررسی می شود تا اعتماد شما در خرید و فروش این جواهرات گران بها تضمین شود.',
        'با توجه به کسب تجربه در حوزه آموزش گوهرشناسی از سال ۱۳۸۴، با افتخار اقدام به تأسیس آموزشگاه فنی و حرفه ای با عنوان گوهر آزمای امید کردیم تا این تجربه ارزشمند در گوهرشناسی را در اختیار علاقه مندان به این رشته جهت ورود به دنیای کسب و کار جواهرات و سنگ های قیمتی قرار دهیم. در حال حاضر در رشته های گوهرشناسی عمومی، شناسایی و درجه بندی سنگ های رنگی، شناسایی و درجه بندی و ارزیابی کیفی الماس و شناسایی و درجه بندی مروارید مشغول آموزش به علاقه مندان هستیم. در انتها به فارغ التحصیلان دوره ها پس از کسب موفقیت، مدرک معتبر فنی و حرفه ای با کد بین المللی اعطا می شود.',
        'تعهد ما به شما، مشتریان عزیز، ارائه کیفیت بی نظیر و صداقت در خدمات است. همچنین به تمامی سوالات شما پاسخ خواهیم داد و شما را در انتخاب بهترین ها همراهی خواهیم کرد.',
        'با ما همراه شوید تا با هم دنیای شگفت انگیز سنگ های قیمتی را کشف کنیم و ارزش های زیبای آن ها را جشن بگیریم.'
      ],
      cards: [
        'پژوهش از سال ۱۳۷۸',
        'اعتبار کارشناس رسمی',
        'پیگیری گواهی اصالت',
        'آموزش گوهرشناسی'
      ],
      cardText: 'بر پایه تجربه عملی، ابزار تخصصی و تعهد به خدمات شفاف.'
    },
    contactPage: {
      label: 'تماس با ما',
      title: 'درخواست صدور گواهی یا مشاوره کارشناسی.',
      text: 'برای صدور گواهی، کارشناسی رسمی، گزارش حقوقی، آموزش گوهرشناسی یا مشاوره پیش از خرید و فروش سنگ های قیمتی با HGL GEM تماس بگیرید.',
      infoTitle: 'اطلاعات تماس',
      name: 'نام',
      namePlaceholder: 'نام شما',
      email: 'ایمیل',
      emailPlaceholder: 'you@example.com',
      requestType: 'نوع درخواست',
      requestPlaceholder: 'گواهی، گزارش حقوقی، آموزش، مشاوره...',
      message: 'پیام',
      messagePlaceholder: 'درباره گوهرسنگ، کد گواهی، دوره آموزشی یا کارشناسی مورد نیاز بنویسید.',
      send: 'ارسال درخواست'
    },
    blogPage: {
      label: 'بلاگ',
      title: 'دانش گوهرسنگ، اخبار گواهی و یادداشت های کارشناسی.',
      text: 'به روزرسانی های HGL GEM، مقاله های آموزشی گوهرشناسی، راهنمای گواهی اصالت و نکات کاربردی برای خرید، فروش و ارزیابی سنگ های قیمتی را بخوانید.'
    },
    searchPage: {
      label: 'جستجو',
      title: 'جستجو در گواهی ها، خدمات و مطالب HGL GEM.',
      text: 'برای جستجوی گواهی ها، خدمات تخصصی، دوره های آموزشی و مطالب گوهرشناسی عبارت مورد نظر خود را وارد کنید.',
      field: 'عبارت جستجو',
      placeholder: 'مثلا گواهی اصالت، الماس، آموزش یا مشاوره',
      button: 'جستجو',
      quickTitle: 'پیشنهادهای سریع',
      quickItems: ['استعلام گواهی اصالت', 'خدمات کارشناسی', 'آموزش گوهرشناسی', 'مشاوره تخصصی'],
      resultTitle: 'نتایج نمونه',
      resultText: 'در حال حاضر این صفحه فقط رابط کاربری جستجو را آماده می کند. اتصال به موتور جستجو یا پایگاه داده در مرحله بعد انجام می شود.'
    },
    notFoundPage: {
      label: '۴۰۴',
      title: 'صفحه مورد نظر پیدا نشد.',
      text: 'ممکن است آدرس تغییر کرده باشد یا صفحه ای با این مسیر وجود نداشته باشد.',
      home: 'بازگشت به خانه',
      contact: 'تماس با ما'
    },
    posts: [
      { slug: 'speed-first-launch', title: 'چگونه اصالت گوهرسنگ را با اطمینان بررسی کنیم', date: '۱۴ مرداد ۱۴۰۵', excerpt: 'چند نکته کاربردی برای توجه به گواهی، شناسنامه و بررسی تخصصی سنگ های قیمتی.' },
      { slug: 'editorial-web-layouts', title: 'اهمیت گزارش کارشناسی در اختلافات حقوقی جواهرات', date: '۶ مرداد ۱۴۰۵', excerpt: 'گزارش رسمی و مستند می تواند مسیر تصمیم گیری در پرونده های اداری و قضایی را روشن تر کند.' },
      { slug: 'placeholder-first-assets', title: 'آموزش گوهرشناسی برای ورود به بازار جواهرات', date: '۲۴ تیر ۱۴۰۵', excerpt: 'دوره های مقدماتی و پیشرفته، مسیر شناخت سنگ های رنگی، الماس و مروارید را منظم تر می کنند.' }
    ],
    singlePost: {
      cover: 'جایگاه تصویر مقاله',
      intro: 'این یک قالب تمیز برای صفحه مقاله است. متن نهایی، تصویر اصلی و جزئیات آموزشی هر مقاله را می توانید بعدا جایگزین کنید.',
      headingOne: 'مفید و قابل پیگیری بنویسید',
      textOne: 'بخش های کوتاه، تیترهای روشن و لینک های دقیق باعث می شوند خواننده سریع تر به اطلاعات مورد نیاز درباره گوهرسنگ ها برسد.',
      headingTwo: 'تصویر را بعدا اضافه کنید',
      textTwo: 'ساختار صفحه قبل از اضافه شدن تصویر نهایی هم پایدار است و بعدا با جایگزینی تصویر، چیدمان دچار پرش نمی شود.'
    },
    footer: {
      text: 'صدور گواهی اصالت، کارشناسی تخصصی، گزارش حقوقی، آموزش و مشاوره گوهرسنگ برای تصمیم گیری مطمئن.',
      contact: 'اطلاعات تماس',
      hoursPrefix: 'ساعت پاسخگویی',
      lastPosts: 'آخرین مطالب بلاگ',
      services: 'خدمات'
    }
  },
  en: {
    langName: 'فا',
    altLocale: 'fa',
    nav: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' }
    ],
    ui: {
      search: 'Search',
      searchTitle: 'Search HGL GEM',
      searchText: 'Search certificates, services, news, and gemstone information.',
      searchTerm: 'Search term',
      searchPlaceholder: 'Type what you want to find',
      verify: 'Verify Certificates',
      verifyLabel: 'Certificate check',
      verifyTitle: 'Verify Certificates',
      verifyText: 'Enter the licence code printed on the gemstone certificate.',
      license: 'Licence code',
      licensePlaceholder: 'Example: HGL-000000',
      close: 'Close modal',
      menu: 'Toggle menu',
      readArticle: 'Read article',
      backToBlog: 'Back to blog'
    },
    hero: {
      label: 'Gemstone certification',
      title: 'Issuance of Authenticity Certificates',
      text: "Issuing authenticity certificates for precious gemstones, which can be verified and tracked through this website. Our expert team uses advanced equipment to assess each stone's authenticity and quality, ensuring confidence in buying and selling these valuable gems.",
      about: 'About HGL GEM',
      contact: 'Contact us'
    },
    why: {
      label: 'Why us',
      title: 'Trusted gemstone expertise, documented clearly.',
      text: 'HGL GEM combines long-running gemology research, certified expert assessment, and certificate services that support confident buying, selling, and learning.',
      points: [
        { title: 'Over 20 years of experience', text: 'Our research and specialist work in the field of gemstones began in 1999.' },
        { title: 'Official court-certified expert', text: 'Member of the Association of Official Court Experts in gold, jewellery, and gemstones.' },
        { title: 'Authenticity certificates', text: 'Our specialist team assesses gemstone authenticity and quality before issuing certificates.' },
        { title: 'International-standard training', text: 'Introductory and advanced gemology courses covering coloured gemstones, diamonds, and pearls.' }
      ]
    },
    aboutPreview: {
      label: 'About us',
      title: 'Two decades of gemstone research, certification, and training.',
      text: 'Our work began in 1999 as a university research project at Ferdowsi University of Mashhad. Today, HGL GEM combines official expert assessment, advanced gemological equipment, and practical education for buyers, sellers, and students of precious stones.',
      button: 'Read about us'
    },
    members: {
      label: 'Members',
      title: 'The expert team behind HGL GEM.',
      phone: 'Phone',
      items: [
        { name: 'Marziyeh Khajeh Yazdi', role: 'M.Sc. Geology and Gemology', text: 'Head of the expert assessment team with more than 20 years of experience in gemstone and jewellery evaluation, certification, and education.', phone: '09153588482' },
        { name: 'Dalaram Pirouz Mehr', role: 'Gemologist and Jewellery Designer', text: 'Active in gemology and jewellery design, with more than 5 years of professional experience in the gemstone field.', phone: '09303588021' },
        { name: 'Mahsa Hassanzadeh', role: 'Legal Affairs Expert', text: 'Member of the legal consultation and expert assessment team, responsible for customer relations and client communication.', phone: '09303588021' }
      ]
    },
    cta: {
      label: 'Call to action',
      title: 'Need to verify a gemstone or request expert guidance?',
      text: 'Contact HGL GEM for authenticity certificates, official expert assessment, legal reports, training information, or consultation before buying and selling precious stones.',
      button: 'Contact HGL GEM'
    },
    services: {
      label: 'Services',
      title: 'Gemstone services for confident decisions.',
      pageTitle: 'Expert assessment, legal reporting, training, and consultation.',
      pageText: 'HGL GEM provides practical gemstone services for buyers, sellers, students, and legal or administrative cases where authenticity and value must be documented clearly.',
      all: 'All services',
      items: [
        { title: 'Expert gemstone assessment', text: 'Specialized evaluation of gemstones, valid identification certificates, and buying or selling guidance based on expert analysis.', pill: 'Assessment' },
        { title: 'Legal and judicial services', text: 'Official court expert assessment for gemstones, gold, and jewellery, including formal reports for judicial and administrative authorities.', pill: 'Legal' },
        { title: 'Gemology training and courses', text: 'Introductory and advanced gemology courses covering coloured stones, diamonds, and pearls, held with Technical and Vocational Training Organization authorization.', pill: 'Training' },
        { title: 'Specialized consultation', text: 'Professional consultation for investing in the gemstone market and making more confident decisions around authenticity, value, and quality.', pill: 'Consulting' }
      ]
    },
    news: {
      label: 'Last news',
      title: 'Recent notes from the studio.'
    },
    aboutPage: {
      label: 'About us',
      title: 'Dedicated to the authenticity, quality, and knowledge of precious gemstones.',
      text: 'HGL GEM supports confident decisions in gemstone buying, selling, certification, and education through long-term research and expert assessment.',
      paragraphs: [
        'Our research in gemstones began in 1999, when this path started as a student project at Ferdowsi University of Mashhad. A deep interest in the beauty and hidden value of natural gems shaped our professional direction.',
        'With more than 20 years of experience in gemstone assessment and education, we are committed to quality, authenticity, and honest guidance. HGL GEM is also a member of the Association of Official Court Experts in gold, jewellery, and gemstones.',
        "One of our key services is issuing authenticity certificates for precious gemstones. These certificates can be tracked and verified through this website. Our specialist team uses advanced equipment to assess each stone's authenticity and quality, helping build confidence in every transaction.",
        'Since 2005, our experience in gemology education has grown into professional training through Gohar Azmay Omid Technical and Vocational Institute. Courses cover general gemology, coloured gemstones, diamonds, and pearls, with recognized certificates awarded after successful completion.'
      ],
      cards: ['Research since 1999', 'Official expert credibility', 'Certificate verification', 'Gemology education'],
      cardText: 'Built on practical experience, specialist tools, and a commitment to transparent service.'
    },
    contactPage: {
      label: 'Contact us',
      title: 'Request gemstone certification or expert guidance.',
      text: 'Contact HGL GEM for certificate issuance, official expert assessment, legal reports, gemology training, or consultation before buying and selling precious stones.',
      infoTitle: 'Contact information',
      name: 'Name',
      namePlaceholder: 'Your name',
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      requestType: 'Request type',
      requestPlaceholder: 'Certificate, legal report, training, consultation...',
      message: 'Message',
      messagePlaceholder: 'Tell us about the gemstone, certificate code, course, or assessment you need.',
      send: 'Send request'
    },
    blogPage: {
      label: 'Blog',
      title: 'Gemstone knowledge, certification news, and expert notes.',
      text: 'Read HGL GEM updates, gemstone education articles, certificate guidance, and practical insights for buying, selling, and evaluating precious stones.'
    },
    searchPage: {
      label: 'Search',
      title: 'Search certificates, services, and HGL GEM articles.',
      text: 'Enter a term to search certificate guidance, expert services, training courses, and gemstone education content.',
      field: 'Search term',
      placeholder: 'Try authenticity certificate, diamond, training, or consultation',
      button: 'Search',
      quickTitle: 'Quick suggestions',
      quickItems: ['Certificate verification', 'Expert assessment', 'Gemology training', 'Specialized consultation'],
      resultTitle: 'Sample results',
      resultText: 'This page prepares the search interface for now. Search engine or database integration can be connected in the next step.'
    },
    notFoundPage: {
      label: '404',
      title: 'Page not found.',
      text: 'The address may have changed, or there may not be a page at this route.',
      home: 'Back to home',
      contact: 'Contact us'
    },
    posts: [
      { slug: 'speed-first-launch', title: 'How to verify gemstone authenticity with confidence', date: 'Aug 4, 2026', excerpt: 'Practical notes on certificates, identification records, and expert gemstone assessment.' },
      { slug: 'editorial-web-layouts', title: 'Why expert reports matter in jewellery disputes', date: 'Jul 28, 2026', excerpt: 'Official, documented reports can make administrative and judicial decisions clearer.' },
      { slug: 'placeholder-first-assets', title: 'Gemology training for entering the jewellery market', date: 'Jul 15, 2026', excerpt: 'Introductory and advanced courses help structure the study of coloured stones, diamonds, and pearls.' }
    ],
    singlePost: {
      cover: 'Blog cover placeholder',
      intro: 'This is a clean single blog template. Replace this placeholder article with the final post content, add your cover image, and keep the structure light.',
      headingOne: 'Keep the page useful',
      textOne: 'Short sections, readable line length, and clear links make blog pages easier to scan. The current layout avoids unnecessary dependencies and keeps all media local.',
      headingTwo: 'Make assets optional',
      textTwo: 'The design works before images arrive because every media slot has a stable aspect ratio. When you add real images later, the layout will not jump.'
    },
    footer: {
      text: 'Gemstone authenticity certificates, expert assessment, legal reporting, training, and consultation for confident decisions.',
      contact: 'Contact information',
      hoursPrefix: 'Response hours',
      lastPosts: 'Last blog posts',
      services: 'Services'
    }
  }
}

function normalizePath(path) {
  const locale = path === '/en' || path.startsWith('/en/') ? 'en' : 'fa'
  const routePath = locale === 'en' ? path.replace(/^\/en/, '') || '/' : path
  return { locale, routePath }
}

function localizeHref(href, locale) {
  if (locale === 'fa') return href
  return href === '/' ? '/en' : `/en${href}`
}

function alternateHref(routePath, nextLocale) {
  return nextLocale === 'fa' ? routePath : localizeHref(routePath, 'en')
}

function useRoute() {
  const getPath = useCallback(() => window.location.pathname || '/', [])
  const [path, setPath] = useState(getPath)

  useEffect(() => {
    const onPop = () => setPath(getPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [getPath])

  const navigate = useCallback((href) => {
    if (href === window.location.pathname) return
    window.history.pushState({}, '', href)
    setPath(href)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return { path, navigate }
}

function App() {
  const { path, navigate } = useRoute()
  const { locale, routePath } = normalizePath(path)
  const copy = content[locale]
  const contacts = contactInfo[locale]
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const currentPost = useMemo(() => copy.posts.find((post) => routePath === `/blog/${post.slug}`), [copy.posts, routePath])

  useEffect(() => {
    document.documentElement.lang = locale === 'fa' ? 'fa' : 'en'
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr'
  }, [locale])

  let page = <NotFoundPage copy={copy} locale={locale} navigate={navigate} />
  if (routePath === '/') page = <HomePage copy={copy} locale={locale} navigate={navigate} />
  if (routePath === '/about') page = <AboutPage copy={copy} />
  if (routePath === '/contact') page = <ContactPage copy={copy} contacts={contacts} />
  if (routePath === '/services') page = <ServicesPage copy={copy} />
  if (routePath === '/blog') page = <BlogPage copy={copy} locale={locale} navigate={navigate} />
  if (routePath === '/search') page = <SearchPage copy={copy} locale={locale} navigate={navigate} />
  if (currentPost) page = <SingleBlogPage copy={copy} locale={locale} post={currentPost} navigate={navigate} />

  return (
    <>
      <Header copy={copy} locale={locale} routePath={routePath} navigate={navigate} onVerify={() => setVerifyOpen(true)} onSearch={() => setSearchOpen(true)} />
      <main>{page}</main>
      <Footer copy={copy} contacts={contacts} locale={locale} navigate={navigate} />
      <VerifyModal copy={copy} open={verifyOpen} onClose={() => setVerifyOpen(false)} />
      <SearchModal copy={copy} locale={locale} navigate={navigate} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function LinkButton({ href, locale, navigate, children, className = '', icon = false }) {
  return (
    <button
      type="button"
      onClick={() => navigate(localizeHref(href, locale))}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      {children}
      {icon && <ArrowRight strokeWidth={1.8} className="direction-arrow h-4 w-4" />}
    </button>
  )
}

function Header({ copy, locale, routePath, navigate, onVerify, onSearch }) {
  const [open, setOpen] = useState(false)

  const go = (href) => {
    navigate(localizeHref(href, locale))
    setOpen(false)
  }

  const languageHref = alternateHref(routePath, copy.altLocale)

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => go('/')} className="flex items-center gap-2 text-start text-ink">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink p-1.5">
            <img src="/assets/img/hgl-logo.webp" alt="HGL GEM logo" className="h-full w-full object-contain" />
          </span>
          <span className="text-base font-semibold">{brandName}</span>
        </button>
        <div className="hidden items-center gap-7 md:flex">
          {copy.nav.map((item) => {
            const NavIcon = navIcons[item.href]

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-ink ${routePath === item.href ? 'text-ink' : 'text-body'}`}
              >
                <NavIcon strokeWidth={1.7} className={`h-[18px] w-[18px] ${routePath === item.href ? 'text-primary' : 'text-muted'}`} />
                {item.label}
              </button>
            )
          })}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <button type="button" onClick={() => navigate(languageHref)} className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-hairlineStrong bg-surface px-3 text-sm font-medium text-ink hover:border-ink" aria-label="Switch language">
            {copy.langName}
            <Globe2 strokeWidth={1.8} className="h-4 w-4 text-muted" />
          </button>
          <button type="button" onClick={onSearch} className="grid h-10 w-10 place-items-center rounded-lg border border-hairlineStrong bg-surface text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" aria-label={copy.ui.search}>
            <Search strokeWidth={1.8} className="h-4 w-4" />
          </button>
          <button type="button" onClick={onVerify} className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink transition-colors hover:bg-primaryActive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
            {copy.ui.verify}
          </button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button type="button" onClick={onVerify} className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-3 text-xs font-medium text-ink transition-colors hover:bg-primaryActive">
            {copy.ui.verify}
          </button>
          <button type="button" onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-lg border border-hairline bg-surface" aria-label={copy.ui.menu}>
            {open ? <X strokeWidth={1.8} /> : <Menu strokeWidth={1.8} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] overflow-y-auto border-t border-hairline bg-canvas md:hidden">
          <div className="mx-auto flex min-h-full max-w-7xl flex-col px-4 py-5">
            <div className="grid gap-3">
              {copy.nav.map((item) => {
                const NavIcon = navIcons[item.href]
                const active = routePath === item.href

                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => go(item.href)}
                    className={`inline-flex min-h-14 items-center gap-3 rounded-xl border px-4 text-start text-base font-medium transition-colors ${active ? 'border-primary/60 bg-primary/10 text-ink' : 'border-hairline bg-surface text-body hover:border-hairlineStrong hover:text-ink'}`}
                  >
                    <span className={`grid h-9 w-9 place-items-center rounded-lg ${active ? 'bg-primary text-ink' : 'bg-canvasSoft text-muted'}`}>
                      <NavIcon strokeWidth={1.8} className="h-5 w-5" />
                    </span>
                    {item.label}
                  </button>
                )
              })}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => navigate(languageHref)} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-hairlineStrong bg-surface px-4 text-sm font-medium text-ink" aria-label="Switch language">
                {copy.langName}
                <Globe2 strokeWidth={1.8} className="h-5 w-5 text-muted" />
              </button>
              <button type="button" onClick={() => { setOpen(false); onSearch() }} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-hairlineStrong bg-surface px-4 text-sm font-medium text-ink" aria-label={copy.ui.search}>
                <Search strokeWidth={1.8} className="h-5 w-5 text-muted" />
                {copy.ui.search}
              </button>
            </div>
            <div className="mt-auto pt-8">
              <div className="rounded-xl border border-hairline bg-surface p-4 text-sm leading-7 text-body">
                <div className="flex gap-3 border-b border-hairline pb-4">
                  <MapPin strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <p>{contactInfo[locale].address}</p>
                </div>
                <div className="flex gap-3 border-b border-hairline py-4">
                  <Clock strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <p>{content[locale].footer.hoursPrefix}: {contactInfo[locale].hours}</p>
                </div>
                <div className="flex gap-3 pt-4">
                  <PhoneCall strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <p className="flex flex-wrap gap-x-2 gap-y-1">
                    <span>{contactInfo[locale].phoneLabel}:</span>
                    {contactInfo.phones.map((phone, index) => (
                      <React.Fragment key={`mobile-${phone.href}`}>
                        {index > 0 && <span className="text-mutedSoft">|</span>}
                        <a href={phone.href} className="font-semibold text-ink hover:text-primary">{phone.label}</a>
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function VerifyModal({ copy, open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/45 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="verify-title">
      <div className="w-full max-w-md rounded-xl border border-hairline bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="badge">{copy.ui.verifyLabel}</p>
            <h2 id="verify-title" className="mt-4 text-2xl font-normal tracking-[-0.01em] text-ink">{copy.ui.verifyTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-body">{copy.ui.verifyText}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-hairlineStrong bg-canvas text-ink hover:border-ink" aria-label={copy.ui.close}>
            <X strokeWidth={1.8} className="h-4 w-4" />
          </button>
        </div>
        <label className="mt-6 block">
          <span className="text-sm font-medium text-ink">{copy.ui.license}</span>
          <input className="mt-2 h-11 w-full rounded-lg border border-hairline bg-canvasSoft px-4 text-sm text-ink outline-none focus:border-primary" placeholder={copy.ui.licensePlaceholder} />
        </label>
        <button type="button" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive">
          {copy.ui.verify}
        </button>
      </div>
    </div>
  )
}

function SearchModal({ copy, locale, navigate, open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/45 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="search-title">
      <div className="w-full max-w-lg rounded-xl border border-hairline bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="badge">{copy.ui.search}</p>
            <h2 id="search-title" className="mt-4 text-2xl font-normal tracking-[-0.01em] text-ink">{copy.ui.searchTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-body">{copy.ui.searchText}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-hairlineStrong bg-canvas text-ink hover:border-ink" aria-label={copy.ui.close}>
            <X strokeWidth={1.8} className="h-4 w-4" />
          </button>
        </div>
        <label className="mt-6 block">
          <span className="text-sm font-medium text-ink">{copy.ui.searchTerm}</span>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-hairline bg-canvasSoft px-4 focus-within:border-primary">
            <Search strokeWidth={1.8} className="h-4 w-4 text-muted" />
            <input className="h-11 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none" placeholder={copy.ui.searchPlaceholder} />
          </div>
        </label>
        <button
          type="button"
          onClick={() => {
            onClose()
            navigate(localizeHref('/search', locale))
          }}
          className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive"
        >
          {copy.ui.search}
        </button>
      </div>
    </div>
  )
}

function HomePage({ copy, locale, navigate }) {
  return (
    <>
      <Hero copy={copy} locale={locale} navigate={navigate} />
      <WhyUs copy={copy} />
      <AboutPreview copy={copy} locale={locale} navigate={navigate} />
      <Members copy={copy} />
      <Cta copy={copy} locale={locale} navigate={navigate} />
      <ServicesPreview copy={copy} locale={locale} navigate={navigate} />
      <LatestNews copy={copy} locale={locale} navigate={navigate} />
    </>
  )
}

function Hero({ copy, locale, navigate }) {
  return (
    <section className="hero-section border-b border-hairline">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_.98fr] lg:items-end">
          <div>
            <p className="badge">{copy.hero.label}</p>
            <h1 className="mt-6 max-w-3xl text-3xl font-normal leading-[1.35] tracking-[-0.01em] text-ink sm:text-4xl lg:text-5xl">{copy.hero.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-body">{copy.hero.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/about" locale={locale} navigate={navigate} className="bg-ink text-canvas hover:bg-primary" icon>{copy.hero.about}</LinkButton>
              <LinkButton href="/contact" locale={locale} navigate={navigate} className="border border-hairlineStrong bg-surface text-ink hover:border-ink">{copy.hero.contact}</LinkButton>
            </div>
          </div>
          <HeroImage />
        </div>
      </div>
    </section>
  )
}

function HeroImage() {
  return (
    <figure className="rounded-xl border border-hairline bg-surface p-3">
      <div className="overflow-hidden rounded-lg border border-hairline bg-canvasSoft">
        <img src="/assets/img/hero-image.webp" alt="Polished turquoise gemstone" className="h-full min-h-[340px] w-full object-cover" decoding="async" fetchPriority="high" />
      </div>
    </figure>
  )
}

function Placeholder({ label }) {
  return (
    <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-hairlineStrong bg-canvasSoft p-4 text-center text-xs font-medium uppercase tracking-[0.08em] text-muted">
      {label}
    </div>
  )
}

function AboutImage({ className = '' }) {
  return (
    <figure className={`overflow-hidden rounded-xl border border-hairline bg-surface p-3 ${className}`}>
      <img src="/assets/img/about-us.webp" alt="Green gemstones under gemological inspection" className="h-full min-h-[320px] w-full rounded-lg object-cover" loading="lazy" decoding="async" />
    </figure>
  )
}

function SectionIntro({ label, title, text }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="badge mx-auto">{label}</p>
      <h2 className="mt-5 text-4xl font-normal tracking-[-0.02em] text-ink sm:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-body">{text}</p>}
    </div>
  )
}

function WhyUs({ copy }) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label={copy.why.label} title={copy.why.title} text={copy.why.text} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {copy.why.points.map((point) => (
            <article key={point.title} className="feature-card">
              <Check strokeWidth={1.8} className="h-5 w-5 text-primary" />
              <h3 className="mt-6 text-lg font-semibold text-ink">{point.title}</h3>
              <p className="mt-3 text-sm leading-6 text-body">{point.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutPreview({ copy, locale, navigate }) {
  return (
    <section className="section-pad border-y border-hairline bg-canvasSoft">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="badge">{copy.aboutPreview.label}</p>
          <h2 className="mt-5 text-4xl font-normal tracking-[-0.02em] text-ink sm:text-5xl">{copy.aboutPreview.title}</h2>
          <p className="mt-5 text-base leading-7 text-body">{copy.aboutPreview.text}</p>
          <LinkButton href="/about" locale={locale} navigate={navigate} className="mt-8 border border-hairlineStrong bg-surface text-ink hover:border-ink" icon>{copy.aboutPreview.button}</LinkButton>
        </div>
        <AboutImage />
      </div>
    </section>
  )
}

function Members({ copy }) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label={copy.members.label} title={copy.members.title} />
        <div className="grid gap-4 md:grid-cols-3">
          {copy.members.items.map((member) => (
            <article key={member.name} className="feature-card">
              <div className="grid h-12 w-12 place-items-center rounded-lg border border-hairline bg-canvasSoft text-base font-semibold text-ink">
                {member.name.replace(/مهندس|کارشناس/g, '').trim().slice(0, 2)}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{member.name}</h3>
              <p className="mt-1 text-sm font-medium text-body">{member.role}</p>
              <p className="mt-3 text-sm leading-6 text-body">{member.text}</p>
              <p className="mt-4 text-sm font-semibold text-ink">{copy.members.phone}: {member.phone}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Cta({ copy, locale, navigate }) {
  return (
    <section className="section-pad border-y border-hairline bg-canvasSoft">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="badge mx-auto">{copy.cta.label}</p>
        <h2 className="mt-5 text-4xl font-normal tracking-[-0.02em] text-ink sm:text-5xl">{copy.cta.title}</h2>
        <p className="mt-5 text-base leading-7 text-body">{copy.cta.text}</p>
        <LinkButton href="/contact" locale={locale} navigate={navigate} className="mt-8 bg-primary text-ink hover:bg-primaryActive" icon>{copy.cta.button}</LinkButton>
      </div>
    </section>
  )
}

function ServicesPreview({ copy, locale, navigate }) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label={copy.services.label} title={copy.services.title} />
        <ServiceGrid services={copy.services.items} />
        <div className="mt-8 text-center">
          <LinkButton href="/services" locale={locale} navigate={navigate} className="border border-hairlineStrong bg-surface text-ink hover:border-ink" icon>{copy.services.all}</LinkButton>
        </div>
      </div>
    </section>
  )
}

function ServiceGrid({ services }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {services.map((service) => (
        <article key={service.title} className="feature-card">
          <span className="badge">{service.pill}</span>
          <h3 className="mt-6 text-2xl font-normal tracking-[-0.01em] text-ink">{service.title}</h3>
          <p className="mt-3 text-sm leading-6 text-body">{service.text}</p>
        </article>
      ))}
    </div>
  )
}

function LatestNews({ copy, locale, navigate }) {
  return (
    <section className="section-pad border-t border-hairline bg-canvasSoft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label={copy.news.label} title={copy.news.title} />
        <PostGrid copy={copy} locale={locale} posts={copy.posts.slice(0, 3)} navigate={navigate} />
      </div>
    </section>
  )
}

function AboutPage({ copy }) {
  return (
    <PageShell label={copy.aboutPage.label} title={copy.aboutPage.title} text={copy.aboutPage.text}>
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <AboutImage className="lg:sticky lg:top-24" />
        <div className="space-y-4 text-base leading-7 text-body">
          {copy.aboutPage.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="grid gap-4 sm:grid-cols-2">
            {copy.aboutPage.cards.map((item) => (
              <div key={item} className="rounded-xl border border-hairline bg-surface p-5">
                <p className="text-sm font-semibold text-ink">{item}</p>
                <p className="mt-2 text-sm leading-6 text-body">{copy.aboutPage.cardText}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

function ContactPage({ copy, contacts }) {
  return (
    <PageShell label={copy.contactPage.label} title={copy.contactPage.title} text={copy.contactPage.text}>
      <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
        <aside className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="text-2xl font-normal tracking-[-0.01em] text-ink">{copy.contactPage.infoTitle}</h2>
          <div className="mt-6 grid gap-5 text-sm leading-6 text-body">
            <div className="flex gap-3">
              <MapPin strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span>{contacts.address}</span>
            </div>
            <div className="flex gap-3">
              <Clock strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span>{contacts.hours}</span>
            </div>
            <div className="flex gap-3">
              <PhoneCall strokeWidth={1.8} className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div className="grid gap-2">
                {contactInfo.phones.map((phone) => <a key={phone.href} href={phone.href} className="font-medium text-ink hover:text-primary">{phone.label}</a>)}
              </div>
            </div>
          </div>
        </aside>
        <form className="rounded-xl border border-hairline bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={copy.contactPage.name} placeholder={copy.contactPage.namePlaceholder} />
            <Field label={copy.contactPage.email} placeholder={copy.contactPage.emailPlaceholder} />
          </div>
          <Field label={copy.contactPage.requestType} placeholder={copy.contactPage.requestPlaceholder} className="mt-4" />
          <label className="mt-4 block">
            <span className="text-sm font-medium text-ink">{copy.contactPage.message}</span>
            <textarea className="mt-2 min-h-36 w-full rounded-lg border border-hairline bg-canvasSoft px-4 py-3 text-sm text-ink outline-none focus:border-primary" placeholder={copy.contactPage.messagePlaceholder} />
          </label>
          <button type="button" className="mt-5 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive">{copy.contactPage.send}</button>
        </form>
      </div>
    </PageShell>
  )
}

function Field({ label, placeholder, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium text-ink">{label}</span>
      <input className="mt-2 h-11 w-full rounded-lg border border-hairline bg-canvasSoft px-4 text-sm text-ink outline-none focus:border-primary" placeholder={placeholder} />
    </label>
  )
}

function ServicesPage({ copy }) {
  return (
    <PageShell label={copy.services.label} title={copy.services.pageTitle} text={copy.services.pageText}>
      <ServiceGrid services={copy.services.items} />
    </PageShell>
  )
}

function BlogPage({ copy, locale, navigate }) {
  return (
    <PageShell label={copy.blogPage.label} title={copy.blogPage.title} text={copy.blogPage.text}>
      <PostGrid copy={copy} locale={locale} posts={copy.posts} navigate={navigate} />
    </PageShell>
  )
}

function SearchPage({ copy }) {
  return (
    <PageShell label={copy.searchPage.label} title={copy.searchPage.title} text={copy.searchPage.text}>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <section className="rounded-xl border border-hairline bg-surface p-6">
          <label className="block">
            <span className="text-sm font-medium text-ink">{copy.searchPage.field}</span>
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-hairline bg-canvasSoft px-4 focus-within:border-primary">
              <Search strokeWidth={1.8} className="h-4 w-4 shrink-0 text-muted" />
              <input className="h-12 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none" placeholder={copy.searchPage.placeholder} />
            </div>
          </label>
          <button type="button" className="mt-5 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive">
            {copy.searchPage.button}
          </button>
        </section>
        <aside className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="text-2xl font-normal tracking-[-0.01em] text-ink">{copy.searchPage.quickTitle}</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {copy.searchPage.quickItems.map((item) => (
              <span key={item} className="rounded-full border border-hairline bg-canvasSoft px-3 py-2 text-sm text-body">
                {item}
              </span>
            ))}
          </div>
        </aside>
      </div>
      <section className="mt-6 rounded-xl border border-hairline bg-surface p-6">
        <h2 className="text-2xl font-normal tracking-[-0.01em] text-ink">{copy.searchPage.resultTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-body">{copy.searchPage.resultText}</p>
      </section>
    </PageShell>
  )
}

function SingleBlogPage({ copy, locale, post, navigate }) {
  return (
    <PageShell label={post.date} title={post.title} text={post.excerpt}>
      <article className="mx-auto max-w-3xl rounded-xl border border-hairline bg-surface p-6 sm:p-8">
        <Placeholder label={copy.singlePost.cover} />
        <div className="prose-copy mt-8">
          <p>{copy.singlePost.intro}</p>
          <h2>{copy.singlePost.headingOne}</h2>
          <p>{copy.singlePost.textOne}</p>
          <h2>{copy.singlePost.headingTwo}</h2>
          <p>{copy.singlePost.textTwo}</p>
        </div>
        <LinkButton href="/blog" locale={locale} navigate={navigate} className="mt-8 border border-hairlineStrong bg-canvas text-ink hover:border-ink">{copy.ui.backToBlog}</LinkButton>
      </article>
    </PageShell>
  )
}

function NotFoundPage({ copy, locale, navigate }) {
  return (
    <PageShell label={copy.notFoundPage.label} title={copy.notFoundPage.title} text={copy.notFoundPage.text}>
      <div className="rounded-xl border border-hairline bg-surface p-6">
        <div className="flex flex-col gap-3 sm:flex-row">
          <LinkButton href="/" locale={locale} navigate={navigate} className="bg-primary text-ink hover:bg-primaryActive" icon>{copy.notFoundPage.home}</LinkButton>
          <LinkButton href="/contact" locale={locale} navigate={navigate} className="border border-hairlineStrong bg-canvas text-ink hover:border-ink">{copy.notFoundPage.contact}</LinkButton>
        </div>
      </div>
    </PageShell>
  )
}

function PostGrid({ copy, locale, posts, navigate }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {posts.map((post) => (
        <article key={post.slug} className="feature-card">
          <Placeholder label={copy.singlePost.cover} />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-muted">{post.date}</p>
          <h3 className="mt-3 text-xl font-normal tracking-[-0.01em] text-ink">{post.title}</h3>
          <p className="mt-3 text-sm leading-6 text-body">{post.excerpt}</p>
          <button type="button" onClick={() => navigate(localizeHref(`/blog/${post.slug}`, locale))} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-primary">
            {copy.ui.readArticle} <ArrowRight strokeWidth={1.8} className="direction-arrow h-4 w-4" />
          </button>
        </article>
      ))}
    </div>
  )
}

function PageShell({ label, title, text, children }) {
  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="badge">{label}</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-normal leading-tight tracking-[-0.03em] text-ink sm:text-6xl">{title}</h1>
          {text && <p className="mt-5 max-w-2xl text-lg leading-8 text-body">{text}</p>}
        </div>
      </section>
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </section>
    </>
  )
}

function Footer({ copy, contacts, locale, navigate }) {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.1fr_1.7fr_repeat(2,1fr)] lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-ink">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink p-1.5">
              <img src="/assets/img/hgl-logo.webp" alt="HGL GEM logo" className="h-full w-full object-contain" />
            </span>
            <span className="font-semibold">{brandName}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-body">{copy.footer.text}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">{copy.footer.contact}</h3>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-body">
            <p>{contacts.address}</p>
            <p>{copy.footer.hoursPrefix}: {contacts.hours}</p>
            <p className="flex flex-wrap gap-x-2 gap-y-1">
              <span>{contacts.phoneLabel}:</span>
              {contactInfo.phones.map((phone, index) => (
                <React.Fragment key={phone.href}>
                  {index > 0 && <span>|</span>}
                  <a href={phone.href} className="font-medium text-ink hover:text-primary">{phone.label}</a>
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">{copy.footer.lastPosts}</h3>
          <div className="mt-4 grid gap-3">
            {copy.posts.slice(0, 3).map((post) => (
              <button key={`footer-${post.slug}`} type="button" onClick={() => navigate(localizeHref(`/blog/${post.slug}`, locale))} className="text-start text-sm leading-6 text-body hover:text-ink">
                {post.title}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">{copy.footer.services}</h3>
          <div className="mt-4 grid gap-3">
            {copy.services.items.map((service) => (
              <button key={`footer-${service.title}`} type="button" onClick={() => navigate(localizeHref('/services', locale))} className="text-start text-sm text-body hover:text-ink">
                {service.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

createRoot(document.getElementById('root')).render(<App />)
