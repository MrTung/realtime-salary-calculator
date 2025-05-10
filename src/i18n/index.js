import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    title: 'Real-Time Salary Calculator',
    monthlySalary: 'Monthly Salary',
    workDays: 'Working Days Per Month',
    workHours: 'Working Hours Per Day',
    startWork: 'Start Work',
    continueWork: 'Continue Work',
    slacking: 'Fishing',
    reset: 'Reset',
    todayWage: "Today's Salary",
    workingTime: 'Working Time',
    slackingTime: 'Fishing Time',
    slackingEarnings: 'Fishing Earnings',
    enterMonthlySalary: 'Enter monthly salary',
    enterWorkDays: 'Enter working days',
    enterWorkHours: 'Enter working hours',
    pleaseFillAll: 'Please fill in all required information!',
    continueWithGitHub: 'Continue With GitHub',
  },
  zh: {
    title: '实时工资计算器',
    monthlySalary: '月工资',
    workDays: '月工作天数',
    workHours: '每天工作时长',
    startWork: '开始工作',
    continueWork: '继续工作',
    slacking: '摸鱼一下',
    reset: '重置',
    todayWage: '今日工资',
    workingTime: '工作时长',
    slackingTime: '摸鱼时长',
    slackingEarnings: '摸鱼白赚',
    enterMonthlySalary: '请输入月工资',
    enterWorkDays: '请输入月工作天数',
    enterWorkHours: '请输入每天工作时长',
    pleaseFillAll: '请填写所有必要信息！',
    continueWithGitHub: ' GitHub 登录',
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
