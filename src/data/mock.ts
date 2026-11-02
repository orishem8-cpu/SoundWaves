export type PublicationStatus="В очереди"|"В работе"|"Выполнено";
export type Publication={id:string,title:string,platform:string,url:string,date:string,status:PublicationStatus,client:string};
export const plans=[{name:"Старт",price:"2 990 ₽",desc:"Для первого продвижения",features:["До 5 публикаций","Базовые площадки","Поддержка"]},{name:"Рост",price:"6 990 ₽",desc:"Для регулярных релизов",features:["До 15 публикаций","Приоритетная очередь","Отчёт по размещениям"]},{name:"Профи",price:"14 990 ₽",desc:"Для активных артистов",features:["До 40 публикаций","Персональный менеджер","Расширенная аналитика"]}];
export const seedPublications:Publication[]=[
{id:"p1",title:"Midnight Drive",platform:"TikTok",url:"https://tiktok.com/",date:"2026-10-28",status:"Выполнено",client:"Артём Волков"},
{id:"p2",title:"Midnight Drive",platform:"Instagram",url:"https://instagram.com/",date:"2026-11-02",status:"В работе",client:"Артём Волков"},
{id:"p3",title:"Без слов",platform:"YouTube",url:"https://youtube.com/",date:"2026-11-05",status:"В очереди",client:"Артём Волков"},
{id:"p4",title:"Neon",platform:"TikTok",url:"https://tiktok.com/",date:"2026-11-07",status:"В очереди",client:"Артём Волков"},
{id:"p5",title:"Тише",platform:"VK",url:"https://vk.com/",date:"2026-10-26",status:"Выполнено",client:"Артём Волков"},
];
export const clients=[{id:"c1",name:"Артём Волков",email:"artem@example.com",plan:"Рост",status:"Активна",joined:"12.09.2026"},{id:"c2",name:"Mira North",email:"mira@example.com",plan:"Профи",status:"Активна",joined:"03.10.2026"},{id:"c3",name:"Luma",email:"luma@example.com",plan:"Старт",status:"Истекла",joined:"19.08.2026"}];
export const payments=[{id:"pay1",date:"28.10.2026",title:"Тариф «Рост»",amount:"6 990 ₽",status:"Оплачен"},{id:"pay2",date:"28.09.2026",title:"Тариф «Рост»",amount:"6 990 ₽",status:"Оплачен"},{id:"pay3",date:"28.08.2026",title:"Тариф «Старт»",amount:"2 990 ₽",status:"Оплачен"}];
