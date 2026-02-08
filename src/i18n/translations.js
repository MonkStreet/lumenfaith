/**
 * Lumen i18n — English (US) / Spanish (Spain)
 * Single source of truth for locale and UI strings (SoC).
 *
 * All user-visible text is here. English content is in getEnContent().
 * Spanish (Castilian) content is in getEsContent(); esES uses it for content.
 */

const STORAGE_KEY = "lumen_locale";

export const LOCALES = {
  EN_US: "en-US",
  ES_ES: "es-ES",
};

export const DEFAULT_LOCALE = LOCALES.EN_US;

/** @returns {string} */
export function getLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === LOCALES.ES_ES || stored === LOCALES.EN_US) return stored;
  } catch (_) {}
  return DEFAULT_LOCALE;
}

/** Persist locale (call after updating app state). */
export function setLocaleStorage(locale) {
  try {
    if (locale === LOCALES.ES_ES || locale === LOCALES.EN_US) {
      localStorage.setItem(STORAGE_KEY, locale);
    }
  } catch (_) {}
}

// ─── English (US) ─────────────────────────────────────────────────────────
const enUS = {
  common: {
    demoUserName: "Pilgrim",
    signOut: "Sign out",
    signInWithGoogle: "Sign in with Google",
    back: "←",
    returnHome: "Return Home",
    continue: "Continue →",
    next: "Next →",
    summary: "Summary",
    complete: "Complete ✝",
    completeExamen: "Complete ✦",
    saving: "Saving...",
    loading: "Loading...",
    syncing: "Syncing...",
    allPrayers: "← All Prayers",
    saveReflection: "Save Reflection",
    clearJournal: "Clear Journal",
    today: "Today",
  },
  home: {
    tagline: "Catholic Spiritual Companion",
    documentTitle: "Lumen — Catholic Spiritual Companion",
    disclaimer: "A tool for prayer, not a replacement for the Sacraments.",
    amdg: "Ad Maiorem Dei Gloriam.",
    holyRosary: "Holy Rosary",
    holyRosaryDesc: "Complete traditional Rosary with Litany of Loreto",
    dailyExamen: "Daily Examen",
    dailyExamenDesc: "St. Ignatius's 5-step prayer with journaling",
    confessionPrep: "Confession Prep",
    confessionPrepDesc: "Examination of conscience — 10 Commandments",
    prayerLibrary: "Prayer Library",
    prayerLibraryDesc: "Essential Catholic prayers for every occasion",
    prayerJournal: "Prayer Journal",
    prayerJournalDescSynced: "Synced for {name} — persists across devices",
    prayerJournalDescGuest: "Sign in to sync across devices",
  },
  footer: {
    language: "Language",
    english: "English",
    spanish: "Español",
  },
  rosary: {
    title: "Holy Rosary",
    chooseMysteries: "Choose your mysteries",
    todayMysteries: "Today's mysteries:",
    rosaryComplete: "Rosary Complete",
    amen: "Amen.",
    mayTheyRest: "May the souls of the faithful departed, through the mercy of God, rest in peace. Amen.",
    openingPrayers: "Opening Prayers",
    closingPrayers: "Closing Prayers",
    decadeOf: "Decade {n} of 5",
    litanyOfLoreto: "Litany of Loreto",
    forIntentionsOfHolyFather: "For the intentions of the Holy Father",
    meditatingOn: "Meditating on:",
    fruit: "Fruit:",
    mysteryOrdinals: ["1st", "2nd", "3rd", "4th", "5th"],
    hailMaryDecade: "Hail Mary {n}/10",
  },
  confession: {
    title: "Examination of Conscience",
    subtitle: "Commandment {current}/10 · {count} marked",
    summaryTitle: "Confession Summary",
    summarySubtitle: "{count} item",
    summarySubtitlePlural: "{count} items",
    quote: "\"There is more joy in heaven over one sinner who repents...\"",
    quoteRef: "— Luke 15:7",
    noItemsChecked: "No items checked. Regular Confession is still a powerful source of grace.",
    actOfContrition: "Act of Contrition",
  },
  examen: {
    title: "Daily Examen",
    savingReflections: "Saving...",
    savingYourReflections: "Saving your reflections...",
    completeTitle: "Examen Complete",
    wellDone: "Well Done",
    reflectionsSaved: "Your reflections have been saved to your journal. ✓",
    step: "Step {n}/5",
    yourReflections: "Your reflections...",
  },
  prayers: {
    title: "Prayer Library",
    essentialPrayers: "Essential Prayers",
    marianPrayers: "Marian Prayers",
    prayersOfSaints: "Prayers of the Saints",
    dailyPrayers: "Daily Prayers",
  },
  journal: {
    title: "Prayer Journal",
    signInTitle: "Sign In to Use Your Journal",
    signInDesc: "Your prayer reflections sync across all your devices when you sign in with Google.",
    placeholder: "Write a reflection, prayer intention, or insight...",
    entriesCount: "{n} entr",
    entriesCountPlural: "ies",
    entriesCountSingular: "y",
    emptyTitle: "Your journal is empty",
    emptyDesc: "Examen reflections and notes appear here.",
    typeExamen: "🕯️ Examen",
    typeReflection: "✍️ Reflection",
  },
  mysteries: {
    Joyful: "Joyful",
    Sorrowful: "Sorrowful",
    Glorious: "Glorious",
    Luminous: "Luminous",
    dayMondaySaturday: "Monday & Saturday",
    dayTuesdayFriday: "Tuesday & Friday",
    dayWednesdaySunday: "Wednesday & Sunday",
    dayThursday: "Thursday",
  },

  // ─── All long-form content (extracted from app); add Spanish in content.esES later ───
  content: getEnContent(),
};

function getEnContent() {
  return {
    prayerTitles: {
      signOfCross: "Sign of the Cross",
      creed: "Apostles' Creed",
      ourFather: "Our Father",
      hailMaryFaith: "Hail Mary — For Faith",
      hailMaryHope: "Hail Mary — For Hope",
      hailMaryCharity: "Hail Mary — For Charity",
      gloryBe: "Glory Be",
      fatima: "Fatima Prayer",
      hailHolyQueen: "Hail, Holy Queen",
      closingPrayer: "Closing Prayer",
    },
    prayers: {
      signOfCross: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
      creed: "I believe in God, the Father Almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord; who was conceived by the Holy Spirit, born of the Virgin Mary; suffered under Pontius Pilate, was crucified, died, and was buried. He descended into hell; the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father Almighty; from thence He shall come to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of Saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
      ourFather: "Our Father, who art in heaven, hallowed be Thy name. Thy kingdom come, Thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. Amen.",
      hailMary: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
      gloryBe: "Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.",
      fatima: "O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to Heaven, especially those in most need of Thy mercy. Amen.",
      hailHolyQueen: "Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope! To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn, then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary!\n\nV. Pray for us, O Holy Mother of God.\nR. That we may be made worthy of the promises of Christ.",
      closingPrayer: "Let us pray. O God, whose Only Begotten Son, by His life, Death, and Resurrection, has purchased for us the rewards of eternal life; grant, we beseech Thee, that by meditating upon these mysteries of the Most Holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.",
      actOfContrition: "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen.",
    },
    litany: [
      { v: "Lord, have mercy.", r: "Lord, have mercy." },
      { v: "Christ, have mercy.", r: "Christ, have mercy." },
      { v: "Lord, have mercy.", r: "Lord, have mercy." },
      { v: "Christ, hear us.", r: "Christ, graciously hear us." },
      { v: "God the Father of Heaven,", r: "have mercy on us." },
      { v: "God the Son, Redeemer of the world,", r: "have mercy on us." },
      { v: "God the Holy Spirit,", r: "have mercy on us." },
      { v: "Holy Trinity, one God,", r: "have mercy on us." },
      { v: "Holy Mary,", r: "pray for us." },
      { v: "Holy Mother of God,", r: "pray for us." },
      { v: "Holy Virgin of virgins,", r: "pray for us." },
      { v: "Mother of Christ,", r: "pray for us." },
      { v: "Mother of the Church,", r: "pray for us." },
      { v: "Mother of Mercy,", r: "pray for us." },
      { v: "Mother of divine grace,", r: "pray for us." },
      { v: "Mother most pure,", r: "pray for us." },
      { v: "Mother most chaste,", r: "pray for us." },
      { v: "Mother inviolate,", r: "pray for us." },
      { v: "Mother undefiled,", r: "pray for us." },
      { v: "Mother most amiable,", r: "pray for us." },
      { v: "Mother most admirable,", r: "pray for us." },
      { v: "Mother of good counsel,", r: "pray for us." },
      { v: "Mother of our Creator,", r: "pray for us." },
      { v: "Mother of our Savior,", r: "pray for us." },
      { v: "Virgin most prudent,", r: "pray for us." },
      { v: "Virgin most venerable,", r: "pray for us." },
      { v: "Virgin most renowned,", r: "pray for us." },
      { v: "Virgin most powerful,", r: "pray for us." },
      { v: "Virgin most merciful,", r: "pray for us." },
      { v: "Virgin most faithful,", r: "pray for us." },
      { v: "Mirror of justice,", r: "pray for us." },
      { v: "Seat of wisdom,", r: "pray for us." },
      { v: "Cause of our joy,", r: "pray for us." },
      { v: "Spiritual vessel,", r: "pray for us." },
      { v: "Vessel of honor,", r: "pray for us." },
      { v: "Singular vessel of devotion,", r: "pray for us." },
      { v: "Mystical rose,", r: "pray for us." },
      { v: "Tower of David,", r: "pray for us." },
      { v: "Tower of ivory,", r: "pray for us." },
      { v: "House of gold,", r: "pray for us." },
      { v: "Ark of the covenant,", r: "pray for us." },
      { v: "Gate of heaven,", r: "pray for us." },
      { v: "Morning star,", r: "pray for us." },
      { v: "Health of the sick,", r: "pray for us." },
      { v: "Refuge of sinners,", r: "pray for us." },
      { v: "Solace of migrants,", r: "pray for us." },
      { v: "Comforter of the afflicted,", r: "pray for us." },
      { v: "Help of Christians,", r: "pray for us." },
      { v: "Queen of Angels,", r: "pray for us." },
      { v: "Queen of Patriarchs,", r: "pray for us." },
      { v: "Queen of Prophets,", r: "pray for us." },
      { v: "Queen of Apostles,", r: "pray for us." },
      { v: "Queen of Martyrs,", r: "pray for us." },
      { v: "Queen of Confessors,", r: "pray for us." },
      { v: "Queen of Virgins,", r: "pray for us." },
      { v: "Queen of all Saints,", r: "pray for us." },
      { v: "Queen conceived without original sin,", r: "pray for us." },
      { v: "Queen assumed into Heaven,", r: "pray for us." },
      { v: "Queen of the most holy Rosary,", r: "pray for us." },
      { v: "Queen of families,", r: "pray for us." },
      { v: "Queen of peace,", r: "pray for us." },
      { v: "Lamb of God, who takes away the sins of the world,", r: "spare us, O Lord." },
      { v: "Lamb of God, who takes away the sins of the world,", r: "graciously hear us, O Lord." },
      { v: "Lamb of God, who takes away the sins of the world,", r: "have mercy on us." },
    ],
    mysteries: {
      Joyful: [
        { title: "The Annunciation", fruit: "Humility", scripture: "The angel said to her, 'Do not be afraid, Mary, for you have found favor with God.' — Luke 1:30", meditation: "Mary's humble 'yes' changed the course of human history. In this moment, Heaven touched Earth. She did not understand everything, but she trusted completely. Consider: where is God asking you to say 'yes' today, even without seeing the full picture?" },
        { title: "The Visitation", fruit: "Love of Neighbor", scripture: "When Elizabeth heard Mary's greeting, the infant leaped in her womb. — Luke 1:41", meditation: "Mary, newly pregnant with the Savior, did not rest — she went in haste to serve her elderly cousin. Joy and charity are inseparable. Who in your life needs you to 'go in haste' to them today?" },
        { title: "The Nativity", fruit: "Poverty of Spirit", scripture: "She wrapped him in swaddling clothes and laid him in a manger, because there was no room for them in the inn. — Luke 2:7", meditation: "The King of Kings chose to enter the world in radical poverty, vulnerability, and silence. God comes not in power but in littleness. Where do you need to let go of worldly attachments to make room for Christ?" },
        { title: "The Presentation", fruit: "Obedience", scripture: "A sword will pierce your own soul too. — Luke 2:35", meditation: "Mary and Joseph faithfully obeyed the Law, presenting Jesus at the Temple. There, Simeon prophesied both glory and suffering. Faithfulness to God does not exempt us from pain — but gives it meaning." },
        { title: "Finding in the Temple", fruit: "Joy in Finding Jesus", scripture: "Why were you searching for me? Did you not know I must be in my Father's house? — Luke 2:49", meditation: "Even Mary and Joseph experienced the anguish of losing Jesus. After three days of searching, they found Him in the Temple. When you feel distant from God, keep searching — He is always in His Father's house, waiting for you." },
      ],
      Sorrowful: [
        { title: "The Agony in the Garden", fruit: "Sorrow for Sin", scripture: "Father, if you are willing, take this cup from me; yet not my will, but yours be done. — Luke 22:42", meditation: "Jesus experienced the full weight of human suffering — fear, loneliness, abandonment. He sweat blood knowing what lay ahead. Yet He chose the Father's will over His own comfort. In your darkest moments, unite your suffering to His." },
        { title: "The Scourging at the Pillar", fruit: "Mortification", scripture: "By his wounds we are healed. — Isaiah 53:5", meditation: "Every lash upon Christ's body was an act of love for you, personally. He endured this not because He had to, but because He wanted to — for your sake. This is the depth of divine love: it holds nothing back." },
        { title: "The Crowning with Thorns", fruit: "Courage", scripture: "They wove a crown of thorns and placed it on his head, and mocked him saying, 'Hail, King of the Jews!' — Matthew 27:29", meditation: "The world mocked Christ's kingship with thorns. Today, the world still mocks faith, virtue, and holiness. Do you have the courage to wear your faith openly, even when it brings ridicule?" },
        { title: "The Carrying of the Cross", fruit: "Patience", scripture: "Whoever wishes to come after me must deny himself, take up his cross, and follow me. — Matthew 16:24", meditation: "Jesus fell three times but rose each time. Simon of Cyrene was called to help carry the cross — we too are called to help carry each other's burdens. What cross are you carrying? Who might help you bear it?" },
        { title: "The Crucifixion", fruit: "Self-Denial", scripture: "Father, forgive them, for they know not what they do. — Luke 23:34", meditation: "From the Cross, Jesus forgave His executioners, comforted a thief, and entrusted His mother to us. Even in death, He gave everything. There is no suffering beyond His reach, no sin beyond His mercy." },
      ],
      Glorious: [
        { title: "The Resurrection", fruit: "Faith", scripture: "He is not here; he has risen, just as he said. — Matthew 28:6", meditation: "Death could not hold Him. The stone was rolled away not so Christ could get out, but so we could look in and see — the tomb is empty. Every fear, every failure, every ending in your life is subject to the power of the Resurrection." },
        { title: "The Ascension", fruit: "Hope", scripture: "I am with you always, until the end of the age. — Matthew 28:20", meditation: "Christ ascended to prepare a place for you. He did not leave us orphans — He sent the Spirit and remains truly present in the Eucharist. Our true home is Heaven." },
        { title: "The Descent of the Holy Spirit", fruit: "Wisdom", scripture: "They were all filled with the Holy Spirit and began to speak in different tongues. — Acts 2:4", meditation: "Fearful apostles became fearless evangelists in an instant. The same Spirit lives in you through Baptism and Confirmation. Ask the Holy Spirit right now: 'Come, and set me on fire.'" },
        { title: "The Assumption of Mary", fruit: "Grace of a Happy Death", scripture: "Blessed is she who believed that what was spoken to her by the Lord would be fulfilled. — Luke 1:45", meditation: "Mary, the first and most faithful disciple, was assumed body and soul into Heaven — a promise of what awaits all who follow her Son." },
        { title: "The Coronation of Mary", fruit: "Trust in Mary's Intercession", scripture: "A great sign appeared in the sky, a woman clothed with the sun, with the moon under her feet. — Revelation 12:1", meditation: "Mary reigns as Queen of Heaven — not by power, but by love and service. She is our Mother, given to us from the Cross. Run to her with confidence." },
      ],
      Luminous: [
        { title: "The Baptism in the Jordan", fruit: "Openness to the Holy Spirit", scripture: "This is my beloved Son, with whom I am well pleased. — Matthew 3:17", meditation: "At His baptism, the Trinity was fully revealed. In your own Baptism, God spoke these same words over you. You are His beloved." },
        { title: "The Wedding at Cana", fruit: "To Jesus Through Mary", scripture: "His mother said to the servants, 'Do whatever he tells you.' — John 2:5", meditation: "Mary noticed the need before anyone else and brought it to Jesus. This is what she does for us still: she notices our needs and whispers, 'Do whatever He tells you.'" },
        { title: "The Proclamation of the Kingdom", fruit: "Repentance and Trust in God", scripture: "The kingdom of God is at hand. Repent, and believe in the gospel. — Mark 1:15", meditation: "Jesus proclaimed a kingdom built on mercy, forgiveness, and love of enemies. This kingdom is not someday; it is now, in every act of charity." },
        { title: "The Transfiguration", fruit: "Desire for Holiness", scripture: "His face shone like the sun, and his clothes became white as light. — Matthew 17:2", meditation: "On Mount Tabor, the apostles saw Christ's glory unveiled. God gives us consolations not as rewards but as fuel for the difficult road." },
        { title: "The Institution of the Eucharist", fruit: "Adoration", scripture: "This is my body, which will be given for you; do this in memory of me. — Luke 22:19", meditation: "The greatest miracle happens at every Mass. God loved you so much that He found a way to remain physically present with you until the end of time." },
      ],
    },
    commandmentExam: [
      { commandment: "1st — I am the Lord your God; you shall not have strange gods before me.", questions: ["Have I doubted or denied that God exists?", "Have I placed excessive trust in money, career, or status above God?", "Have I failed to pray daily?", "Have I been involved in superstition, the occult, or horoscopes?", "Have I received Communion in a state of mortal sin?", "Have I despaired of God's mercy or presumed upon it?"] },
      { commandment: "2nd — You shall not take the name of the Lord your God in vain.", questions: ["Have I used God's name carelessly or as a curse?", "Have I used the names of Jesus, Mary, or the Saints irreverently?", "Have I broken a solemn promise or oath?", "Have I spoken against God in anger?"] },
      { commandment: "3rd — Remember to keep holy the Lord's Day.", questions: ["Have I missed Mass on Sundays or Holy Days without serious reason?", "Have I arrived late or left early from Mass without good cause?", "Have I been inattentive or irreverent at Mass?", "Have I done unnecessary work on Sundays preventing rest and worship?"] },
      { commandment: "4th — Honor your father and your mother.", questions: ["Have I disobeyed or disrespected my parents?", "Have I neglected to care for aging parents or family members?", "Have I failed to be a good example to my children?", "Have I neglected my family for work, hobbies, or screens?"] },
      { commandment: "5th — You shall not kill.", questions: ["Have I physically harmed anyone?", "Have I had an abortion or encouraged one?", "Have I harbored hatred, anger, or resentment?", "Have I refused to forgive someone?", "Have I bullied, ridiculed, or humiliated someone?", "Have I been reckless with my health?", "Have I given scandal — leading others into sin?"] },
      { commandment: "6th — You shall not commit adultery.", questions: ["Have I been unfaithful to my spouse in thought or action?", "Have I engaged in sexual activity outside of marriage?", "Have I used pornography or entertained impure thoughts deliberately?", "Have I failed to respect the dignity of my own body or another's?"] },
      { commandment: "7th — You shall not steal.", questions: ["Have I stolen anything, no matter how small?", "Have I cheated at work, school, or in business?", "Have I failed to pay debts or return borrowed items?", "Have I wasted money irresponsibly while others go without?"] },
      { commandment: "8th — You shall not bear false witness.", questions: ["Have I lied?", "Have I gossiped about others behind their back?", "Have I damaged someone's reputation through lies?", "Have I revealed private information that should be kept secret?", "Have I failed to speak up when the truth needed defending?"] },
      { commandment: "9th — You shall not covet your neighbor's wife.", questions: ["Have I deliberately entertained impure desires about another person?", "Have I been unfaithful in my heart?", "Have I failed to guard my eyes and thoughts?", "Have I consumed media that encourages lustful thoughts?"] },
      { commandment: "10th — You shall not covet your neighbor's goods.", questions: ["Have I been envious of what others have?", "Have I been greedy or materialistic?", "Have I been ungrateful for God's blessings?", "Have I placed my happiness in possessions rather than in God?", "Have I resented others' success or good fortune?"] },
    ],
    examenSteps: [
      { title: "God's Presence", icon: "✦", instruction: "Become still. Take a deep breath. God is here with you right now — not as a distant observer, but as a loving Father sitting beside you.", prompt: "\"Lord, I believe you are here. Help me see this day through your eyes.\"", questions: ["Take 30 seconds of silence. Breathe. Let the noise of the day fade."] },
      { title: "Gratitude", icon: "♡", instruction: "Walk through your day from the moment you woke up. What gifts did God give you today? They may be small — a warm cup of coffee, a kind word, sunshine.", prompt: "\"Every good and perfect gift is from above.\" — James 1:17", questions: ["What moment today brought you joy or peace?", "What person today were you grateful for?", "What simple blessing did you perhaps overlook?"] },
      { title: "Review of the Day", icon: "◈", instruction: "Like watching a movie of your day, let it replay. Where did you feel drawn toward God (consolation)? Where did you feel drawn away (desolation)?", prompt: "Don't judge — just notice, with God beside you.", questions: ["When did you feel most alive, joyful, or at peace today?", "When did you feel most drained, anxious, or distant from God?", "Was there a moment you felt God's presence?", "Was there a moment you ignored God's gentle nudge?"] },
      { title: "Sorrow & Forgiveness", icon: "✝", instruction: "With great tenderness, look at the moments where you fell short. God already knows — He is merciful. Bring these moments to Him like a child brings a broken toy to a parent.", prompt: "\"Though your sins are like scarlet, they shall be as white as snow.\" — Isaiah 1:18", questions: ["Where did you fail to love today?", "Did you sin in thought, word, deed, or omission?", "Is there someone you need to forgive — including yourself?"] },
      { title: "Grace for Tomorrow", icon: "☀", instruction: "Look ahead to tomorrow. What challenges await? Ask God for the specific graces you'll need.", prompt: "\"His mercies are new every morning.\" — Lamentations 3:23", questions: ["What do you need most from God tomorrow?", "Is there a specific situation where you need His help?", "Close with an Our Father and place tomorrow in God's hands."] },
    ],
    prayerLibrary: [
      { nameKey: "essentialPrayers", prayers: [
        { title: "Our Father", textKey: "ourFather" }, { title: "Hail Mary", textKey: "hailMary" }, { title: "Glory Be", textKey: "gloryBe" },
        { title: "Act of Contrition", textKey: "actOfContrition" }, { title: "Apostles' Creed", textKey: "creed" },
      ]},
      { nameKey: "marianPrayers", prayers: [
        { title: "Memorare", text: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my mother; to thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen." },
        { title: "Hail, Holy Queen", textKey: "hailHolyQueen" },
        { title: "Angelus", text: "V. The Angel of the Lord declared unto Mary,\nR. And she conceived of the Holy Spirit.\nHail Mary...\n\nV. Behold the handmaid of the Lord,\nR. Be it done unto me according to thy word.\nHail Mary...\n\nV. And the Word was made flesh,\nR. And dwelt among us.\nHail Mary...\n\nPour forth, we beseech Thee, O Lord, Thy grace into our hearts, that we, to whom the Incarnation of Christ Thy Son was made known by the message of an Angel, may by His Passion and Cross be brought to the glory of His Resurrection. Through the same Christ our Lord. Amen." },
      ]},
      { nameKey: "prayersOfSaints", prayers: [
        { title: "Prayer of St. Francis", text: "Lord, make me an instrument of your peace.\nWhere there is hatred, let me sow love;\nWhere there is injury, pardon;\nWhere there is doubt, faith;\nWhere there is despair, hope;\nWhere there is darkness, light;\nWhere there is sadness, joy.\n\nO Divine Master, grant that I may not so much seek\nTo be consoled as to console;\nTo be understood as to understand;\nTo be loved as to love.\nFor it is in giving that we receive;\nIt is in pardoning that we are pardoned;\nAnd it is in dying that we are born to eternal life. Amen." },
        { title: "Suscipe — St. Ignatius", text: "Take, Lord, and receive all my liberty, my memory, my understanding, and my entire will, all I have and call my own. You have given all to me. To you, Lord, I return it. Everything is yours; do with it what you will. Give me only your love and your grace — that is enough for me." },
        { title: "St. Michael Prayer", text: "Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray, and do thou, O Prince of the heavenly hosts, by the power of God, cast into hell Satan, and all the evil spirits, who prowl about the world seeking the ruin of souls. Amen." },
        { title: "Anima Christi", text: "Soul of Christ, sanctify me.\nBody of Christ, save me.\nBlood of Christ, inebriate me.\nWater from the side of Christ, wash me.\nPassion of Christ, strengthen me.\nO good Jesus, hear me.\nWithin Thy wounds hide me.\nSuffer me not to be separated from Thee.\nFrom the malignant enemy defend me.\nIn the hour of my death call me.\nAnd bid me come unto Thee.\nThat I may praise Thee with Thy saints\nand with Thy angels, forever and ever. Amen." },
      ]},
      { nameKey: "dailyPrayers", prayers: [
        { title: "Morning Offering", text: "O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day, for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, for the salvation of souls, the reparation of sins, the reunion of all Christians, and in particular for the intentions of the Holy Father this month. Amen." },
        { title: "Guardian Angel Prayer", text: "Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen." },
        { title: "Grace Before Meals", text: "Bless us, O Lord, and these Thy gifts, which we are about to receive from Thy bounty, through Christ our Lord. Amen." },
        { title: "Night Prayer", text: "Visit, we beseech Thee, O Lord, this dwelling, and drive far from it all snares of the enemy. Let Thy holy angels dwell herein, to preserve us in peace; and let Thy blessing be upon us, through Jesus Christ our Lord. Amen.\n\nWatch, O Lord, with those who wake, or watch, or weep tonight, and give Your angels and saints charge over those who sleep. Tend Your sick ones, O Lord Christ. Rest Your weary ones. Bless Your dying ones. Soothe Your suffering ones. Shield Your joyous ones. And all for Your love's sake. Amen." },
      ]},
    ],
    saintsQuotes: [
      { quote: "Be who God meant you to be and you will set the world on fire.", saint: "St. Catherine of Siena" },
      { quote: "Pray, hope, and don't worry.", saint: "St. Padre Pio" },
      { quote: "Do small things with great love.", saint: "St. Teresa of Calcutta" },
      { quote: "You have made us for yourself, O Lord, and our hearts are restless until they rest in you.", saint: "St. Augustine" },
      { quote: "Joy is the surest sign of the presence of God.", saint: "St. Teresa of Ávila" },
      { quote: "Have patience with all things, but first of all with yourself.", saint: "St. Francis de Sales" },
      { quote: "We are not the sum of our weaknesses and failures; we are the sum of the Father's love for us.", saint: "St. John Paul II" },
      { quote: "Fall in love, stay in love, and it will decide everything.", saint: "Fr. Pedro Arrupe, S.J." },
    ],
  };
}

// ─── Spanish (Castilian) content ──────────────────────────────────────────
function getEsContent() {
  return {
    prayerTitles: {
      signOfCross: "Señal de la Cruz",
      creed: "Credo de los Apóstoles",
      ourFather: "Padre Nuestro",
      hailMaryFaith: "Ave María — Por la Fe",
      hailMaryHope: "Ave María — Por la Esperanza",
      hailMaryCharity: "Ave María — Por la Caridad",
      gloryBe: "Gloria al Padre",
      fatima: "Oración de Fátima",
      hailHolyQueen: "Salve",
      closingPrayer: "Oración final",
    },
    prayers: {
      signOfCross: "En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.",
      creed: "Creo en Dios, Padre todopoderoso,\nCreador del cielo y de la tierra.\nCreo en Jesucristo, su único Hijo, nuestro Señor,\nque fue concebido por obra y gracia del Espíritu Santo,\nnació de Santa María Virgen,\npadeció bajo el poder de Poncio Pilato,\nfue crucificado, muerto y sepultado.\nDescendió a los infiernos.\nAl tercer día resucitó de entre los muertos.\nSubió a los cielos\ny está sentado a la derecha de Dios Padre todopoderoso.\nDesde allí ha de venir a juzgar a vivos y muertos.\nCreo en el Espíritu Santo,\nla santa Iglesia católica,\nla comunión de los santos,\nel perdón de los pecados,\nla resurrección de la carne\ny la vida eterna. Amén.",
      ourFather: "Padre nuestro que estás en el cielo,\nsantificado sea tu nombre.\nVenga tu reino.\nHágase tu voluntad así en la tierra como en el cielo.\nDanos hoy nuestro pan de cada día.\nPerdona nuestras ofensas,\ncomo también nosotros perdonamos a los que nos ofenden.\nNo nos dejes caer en la tentación,\ny líbranos del mal.\nAmén.",
      hailMary: "Dios te salve, María,\nllena eres de gracia,\nel Señor es contigo.\nBendita tú eres entre todas las mujeres,\ny bendito es el fruto de tu vientre, Jesús.\nSanta María, Madre de Dios,\nruega por nosotros pecadores,\nahora y en la hora de nuestra muerte.\nAmén.",
      gloryBe: "Gloria al Padre, y al Hijo, y al Espíritu Santo.\nComo era en el principio, ahora y siempre,\npor los siglos de los siglos.\nAmén.",
      fatima: "¡Oh Jesús mío!\nPerdona nuestros pecados,\nlíbranos del fuego del infierno,\nlleva al cielo a todas las almas,\ny socorre especialmente a las más necesitadas de tu misericordia.\nAmén.",
      hailHolyQueen: "Dios te salve, Reina y Madre de misericordia,\nvida, dulzura y esperanza nuestra;\nDios te salve.\nA ti llamamos los desterrados hijos de Eva;\na ti suspiramos, gimiendo y llorando en este valle de lágrimas.\nEa, pues, Señora, abogada nuestra,\nvuelve a nosotros esos tus ojos misericordiosos,\ny después de este destierro muéstranos a Jesús,\nfruto bendito de tu vientre.\n¡Oh clementísima, oh piadosa, oh dulce Virgen María!\n\nV. Ruega por nosotros, Santa Madre de Dios.\nR. Para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo.",
      closingPrayer: "Oh Dios, cuyo Unigénito Hijo,\ncon su vida, muerte y resurrección,\nnos obtuvo el premio de la salvación eterna;\nconcédenos, te suplicamos,\nque, meditando estos misterios del santísimo Rosario de la Virgen María,\nimitamos lo que contienen\ny alcancemos lo que prometen.\nPor el mismo Cristo nuestro Señor.\nAmén.",
      actOfContrition: "Dios mío, me arrepiento de todo corazón\nde haberte ofendido,\ny detesto todos mis pecados,\nporque merecen tus castigos,\npero sobre todo porque te ofenden a ti,\nmi Dios, que eres tan bueno y digno de todo mi amor.\nPropongo firmemente,\ncon la ayuda de tu gracia,\nconfesarme, enmendarme y no volver a pecar.\nAmén.",
    },
    litany: [
      { v: "Señor, ten piedad.", r: "Señor, ten piedad." },
      { v: "Cristo, ten piedad.", r: "Cristo, ten piedad." },
      { v: "Señor, ten piedad.", r: "Señor, ten piedad." },
      { v: "Cristo, óyenos.", r: "Cristo, escúchanos." },
      { v: "Dios, Padre celestial,", r: "ten piedad de nosotros." },
      { v: "Dios, Hijo, Redentor del mundo,", r: "ten piedad de nosotros." },
      { v: "Dios, Espíritu Santo,", r: "ten piedad de nosotros." },
      { v: "Santísima Trinidad, un solo Dios,", r: "ten piedad de nosotros." },
      { v: "Santa María,", r: "ruega por nosotros." },
      { v: "Santa Madre de Dios,", r: "ruega por nosotros." },
      { v: "Santa Virgen de las vírgenes,", r: "ruega por nosotros." },
      { v: "Madre de Cristo,", r: "ruega por nosotros." },
      { v: "Madre de la Iglesia,", r: "ruega por nosotros." },
      { v: "Madre de la misericordia,", r: "ruega por nosotros." },
      { v: "Madre de la divina gracia,", r: "ruega por nosotros." },
      { v: "Madre purísima,", r: "ruega por nosotros." },
      { v: "Madre castísima,", r: "ruega por nosotros." },
      { v: "Madre siempre virgen,", r: "ruega por nosotros." },
      { v: "Madre inmaculada,", r: "ruega por nosotros." },
      { v: "Madre amable,", r: "ruega por nosotros." },
      { v: "Madre admirable,", r: "ruega por nosotros." },
      { v: "Madre del buen consejo,", r: "ruega por nosotros." },
      { v: "Madre del Creador,", r: "ruega por nosotros." },
      { v: "Madre del Salvador,", r: "ruega por nosotros." },
      { v: "Virgen prudentísima,", r: "ruega por nosotros." },
      { v: "Virgen digna de veneración,", r: "ruega por nosotros." },
      { v: "Virgen digna de alabanza,", r: "ruega por nosotros." },
      { v: "Virgen poderosa,", r: "ruega por nosotros." },
      { v: "Virgen clemente,", r: "ruega por nosotros." },
      { v: "Virgen fiel,", r: "ruega por nosotros." },
      { v: "Espejo de justicia,", r: "ruega por nosotros." },
      { v: "Trono de la sabiduría,", r: "ruega por nosotros." },
      { v: "Causa de nuestra alegría,", r: "ruega por nosotros." },
      { v: "Vaso espiritual,", r: "ruega por nosotros." },
      { v: "Vaso honorable,", r: "ruega por nosotros." },
      { v: "Vaso de insigne devoción,", r: "ruega por nosotros." },
      { v: "Rosa mística,", r: "ruega por nosotros." },
      { v: "Torre de David,", r: "ruega por nosotros." },
      { v: "Torre de marfil,", r: "ruega por nosotros." },
      { v: "Casa de oro,", r: "ruega por nosotros." },
      { v: "Arca de la alianza,", r: "ruega por nosotros." },
      { v: "Puerta del cielo,", r: "ruega por nosotros." },
      { v: "Estrella de la mañana,", r: "ruega por nosotros." },
      { v: "Salud de los enfermos,", r: "ruega por nosotros." },
      { v: "Refugio de los pecadores,", r: "ruega por nosotros." },
      { v: "Consuelo de los migrantes,", r: "ruega por nosotros." },
      { v: "Consoladora de los afligidos,", r: "ruega por nosotros." },
      { v: "Auxilio de los cristianos,", r: "ruega por nosotros." },
      { v: "Reina de los ángeles,", r: "ruega por nosotros." },
      { v: "Reina de los patriarcas,", r: "ruega por nosotros." },
      { v: "Reina de los profetas,", r: "ruega por nosotros." },
      { v: "Reina de los apóstoles,", r: "ruega por nosotros." },
      { v: "Reina de los mártires,", r: "ruega por nosotros." },
      { v: "Reina de los confesores,", r: "ruega por nosotros." },
      { v: "Reina de las vírgenes,", r: "ruega por nosotros." },
      { v: "Reina de todos los santos,", r: "ruega por nosotros." },
      { v: "Reina concebida sin pecado original,", r: "ruega por nosotros." },
      { v: "Reina asunta a los cielos,", r: "ruega por nosotros." },
      { v: "Reina del santísimo Rosario,", r: "ruega por nosotros." },
      { v: "Reina de las familias,", r: "ruega por nosotros." },
      { v: "Reina de la paz,", r: "ruega por nosotros." },
      { v: "Cordero de Dios, que quitas el pecado del mundo,", r: "perdónanos, Señor." },
      { v: "Cordero de Dios, que quitas el pecado del mundo,", r: "escúchanos, Señor." },
      { v: "Cordero de Dios, que quitas el pecado del mundo,", r: "ten piedad de nosotros." },
    ],
    mysteries: {
      Joyful: [
        { title: "La Anunciación", fruit: "Humildad", scripture: "El ángel le dijo: «No temas, María, porque has hallado gracia delante de Dios.» — Lc 1,30", meditation: "El «sí» humilde de María cambió el curso de la historia humana. En ese momento, el Cielo tocó la Tierra. Ella no lo entendía todo, pero confió plenamente. Considera: ¿dónde te pide Dios que digas «sí» hoy, incluso sin ver el panorama completo?" },
        { title: "La Visitación", fruit: "Amor al prójimo", scripture: "Al oír Isabel el saludo de María, el niño saltó en su seno. — Lc 1,41", meditation: "María, recién embarazada del Salvador, no descansó: fue apresuradamente a servir a su prima anciana. La alegría y la caridad son inseparables. ¿Quién en tu vida necesita que «vayas con prisa» hacia él hoy?" },
        { title: "La Natividad", fruit: "Pobreza de espíritu", scripture: "Lo envolvió en pañales y lo acostó en un pesebre, porque no había sitio para ellos en el albergue. — Lc 2,7", meditation: "El Rey de Reyes eligió entrar en el mundo en pobreza radical, vulnerabilidad y silencio. Dios viene no en el poder, sino en la pequeñez. ¿Dónde necesitas desprenderte de apegos mundanos para hacer sitio a Cristo?" },
        { title: "La Presentación en el Templo", fruit: "Obediencia", scripture: "Y una espada atravesará tu alma. — Lc 2,35", meditation: "María y José obedecieron fielmente la Ley presentando a Jesús en el Templo. Allí, Simeón profetizó gloria y sufrimiento. La fidelidad a Dios no nos exime del dolor, pero le da sentido." },
        { title: "El Hallazgo del Niño Jesús en el Templo", fruit: "Gozo al encontrar a Jesús", scripture: "¿Por qué me buscabais? ¿No sabíais que yo debo ocuparme de las cosas de mi Padre? — Lc 2,49", meditation: "Incluso María y José experimentaron la angustia de perder a Jesús. Tras tres días de búsqueda, lo encontraron en el Templo. Cuando te sientas lejos de Dios, sigue buscando: Él siempre está en la casa de su Padre, esperándote." },
      ],
      Sorrowful: [
        { title: "La Agonía en el Huerto", fruit: "Dolor de los pecados", scripture: "Padre, si quieres, aparta de mí este cáliz; pero no se haga mi voluntad, sino la tuya. — Lc 22,42", meditation: "Jesús experimentó el peso completo del sufrimiento humano: miedo, soledad, abandono. Sudó sangre sabiendo lo que le esperaba. Sin embargo, eligió la voluntad del Padre por encima de su propio consuelo. En tus momentos más oscuros, une tu sufrimiento al suyo." },
        { title: "La Flagelación", fruit: "Mortificación", scripture: "Con sus llagas hemos sido curados. — Is 53,5", meditation: "Cada latigazo en el cuerpo de Cristo fue un acto de amor por ti, personalmente. Lo soportó no porque tuviera que hacerlo, sino porque quiso, por ti. Esta es la profundidad del amor divino: no retiene nada." },
        { title: "La Coronación de espinas", fruit: "Valor", scripture: "Tejieron una corona de espinas, se la pusieron en la cabeza y le decían: «¡Salve, rey de los judíos!» — Mt 27,29", meditation: "El mundo se burló de la realeza de Cristo con espinas. Hoy, el mundo aún se burla de la fe, la virtud y la santidad. ¿Tienes el valor de llevar tu fe abiertamente, incluso cuando trae burla?" },
        { title: "Jesús con la Cruz a cuestas", fruit: "Paciencia en las pruebas", scripture: "El que quiera venir en pos de mí, niéguese a sí mismo, tome su cruz y sígame. — Mt 16,24", meditation: "Jesús cayó tres veces, pero se levantó cada vez. Simón de Cirene fue llamado a ayudar a llevar la cruz: nosotros también estamos llamados a llevar las cargas de los demás. ¿Qué cruz llevas? ¿Quién podría ayudarte a llevarla?" },
        { title: "La Crucifixión y muerte de Jesús", fruit: "Abnegación", scripture: "Padre, perdónalos, porque no saben lo que hacen. — Lc 23,34", meditation: "Desde la Cruz, Jesús perdonó a sus verdugos, consoló a un ladrón y nos confió a su madre. Incluso en la muerte, lo dio todo. No hay sufrimiento fuera de su alcance, ningún pecado fuera de su misericordia." },
      ],
      Glorious: [
        { title: "La Resurrección", fruit: "Fe", scripture: "No está aquí, ha resucitado, como había dicho. — Mt 28,6", meditation: "La muerte no pudo retenerlo. La piedra fue removida no para que Cristo saliera, sino para que nosotros pudiéramos mirar y ver: la tumba está vacía. Todo miedo, todo fracaso, todo final en tu vida está sujeto al poder de la Resurrección." },
        { title: "La Ascensión", fruit: "Esperanza", scripture: "Yo estoy con vosotros todos los días, hasta el fin del mundo. — Mt 28,20", meditation: "Cristo ascendió para prepararnos un lugar. No nos dejó huérfanos: envió el Espíritu y permanece verdaderamente presente en la Eucaristía. Nuestra verdadera patria es el Cielo." },
        { title: "La Venida del Espíritu Santo", fruit: "Sabiduría", scripture: "Quedaron todos llenos del Espíritu Santo y comenzaron a hablar en otras lenguas. — Hch 2,4", meditation: "Apóstoles temerosos se convirtieron en evangelizadores intrépidos en un instante. El mismo Espíritu vive en ti por el Bautismo y la Confirmación. Pide ahora al Espíritu Santo: «Ven y enciéndeme»." },
        { title: "La Asunción de María", fruit: "Gracia de una buena muerte", scripture: "Bendita tú, que has creído, porque lo que te ha dicho el Señor se cumplirá. — Lc 1,45", meditation: "María, la primera y más fiel discípula, fue asunta en cuerpo y alma al Cielo: promesa de lo que espera a todos los que siguen a su Hijo." },
        { title: "La Coronación de María", fruit: "Confianza en la intercesión de María", scripture: "Una gran señal apareció en el cielo: una mujer vestida de sol, con la luna bajo sus pies. — Ap 12,1", meditation: "María reina como Reina del Cielo, no por poder, sino por amor y servicio. Es nuestra Madre, dada desde la Cruz. Acude a ella con confianza." },
      ],
      Luminous: [
        { title: "El Bautismo de Jesús en el Jordán", fruit: "Apertura al Espíritu Santo", scripture: "Este es mi Hijo amado, en quien me complazco. — Mt 3,17", meditation: "En su bautismo, la Trinidad se reveló plenamente. En tu propio Bautismo, Dios pronunció las mismas palabras sobre ti. Eres su amado." },
        { title: "Las Bodas de Caná", fruit: "A Jesús por María", scripture: "Su madre dijo a los sirvientes: «Haced lo que él os diga». — Jn 2,5", meditation: "María notó la necesidad antes que nadie y la llevó a Jesús. Esto es lo que hace por nosotros aún: nota nuestras necesidades y susurra «Haced lo que él os diga»." },
        { title: "El Anuncio del Reino", fruit: "Conversión", scripture: "El reino de Dios está cerca. Convertíos y creed en el Evangelio. — Mc 1,15", meditation: "Jesús proclamó un reino basado en misericordia, perdón y amor a los enemigos. Este reino no es para mañana; es ahora, en cada acto de caridad." },
        { title: "La Transfiguración", fruit: "Deseo de santidad", scripture: "Su rostro brillaba como el sol y sus vestidos se volvieron blancos como la luz. — Mt 17,2", meditation: "En el monte Tabor, los apóstoles vieron la gloria de Cristo desvelada. Dios nos da consolaciones no como premio, sino como combustible para el camino difícil." },
        { title: "La Institución de la Eucaristía", fruit: "Adoración", scripture: "Esto es mi cuerpo, que se entrega por vosotros; haced esto en memoria mía. — Lc 22,19", meditation: "El mayor milagro ocurre en cada Misa. Dios te amó tanto que encontró una manera de permanecer físicamente presente contigo hasta el fin de los tiempos." },
      ],
    },
    commandmentExam: [
      { commandment: "1.º — Yo soy el Señor tu Dios: no tendrás dioses ajenos delante de mí.", questions: ["¿He dudado o negado la existencia de Dios?", "¿He puesto excesiva confianza en el dinero, la carrera o el estatus por encima de Dios?", "¿He fallado en rezar diariamente?", "¿Me he involucrado en supersticiones, ocultismo o horóscopos?", "¿He recibido la Comunión en estado de pecado mortal?", "¿He desesperado de la misericordia de Dios o presumido de ella?"] },
      { commandment: "2.º — No tomarás el nombre de Dios en vano.", questions: ["¿He usado el nombre de Dios con descuido o como maldición?", "¿He usado los nombres de Jesús, María o los santos de manera irreverente?", "¿He roto una promesa o juramento solemne?", "¿He hablado contra Dios en la ira?"] },
      { commandment: "3.º — Santificarás las fiestas.", questions: ["¿He faltado a Misa los domingos o días de precepto sin causa grave?", "¿He llegado tarde o salido temprano de Misa sin buena razón?", "¿He estado distraído o irreverente en Misa?", "¿He realizado trabajos innecesarios los domingos que impiden el descanso y la adoración?"] },
      { commandment: "4.º — Honrarás a tu padre y a tu madre.", questions: ["¿He desobedecido o faltado al respeto a mis padres?", "¿He descuidado el cuidado de padres o familiares ancianos?", "¿He fallado en dar buen ejemplo a mis hijos?", "¿He descuidado a mi familia por trabajo, aficiones o pantallas?"] },
      { commandment: "5.º — No matarás.", questions: ["¿He dañado físicamente a alguien?", "¿He tenido o favorecido un aborto?", "¿He albergado odio, ira o resentimiento?", "¿Me he negado a perdonar a alguien?", "¿He acosado, ridiculizado o humillado a alguien?", "¿He sido imprudente con mi salud?", "¿He dado escándalo — llevando a otros al pecado?"] },
      { commandment: "6.º — No cometerás actos impuros.", questions: ["¿He sido infiel a mi cónyuge en pensamiento o acción?", "¿He participado en actividad sexual fuera del matrimonio?", "¿He usado pornografía o entretenido pensamientos impuros deliberadamente?", "¿He fallado en respetar la dignidad de mi cuerpo o del de otro?"] },
      { commandment: "7.º — No robarás.", questions: ["¿He robado algo, por pequeño que sea?", "¿He hecho trampas en el trabajo, escuela o negocios?", "¿He fallado en pagar deudas o devolver cosas prestadas?", "¿He gastado dinero irresponsablemente mientras otros pasan necesidad?"] },
      { commandment: "8.º — No darás falso testimonio.", questions: ["¿He mentido?", "¿He chismeado sobre otros a sus espaldas?", "¿He dañado la reputación de alguien con mentiras?", "¿He revelado información privada que debería mantenerse en secreto?", "¿He fallado en defender la verdad cuando era necesario?"] },
      { commandment: "9.º — No consentirás pensamientos ni deseos impuros.", questions: ["¿He entretenido deliberadamente deseos impuros sobre otra persona?", "¿He sido infiel en mi corazón?", "¿He fallado en custodiar mis ojos y pensamientos?", "¿He consumido medios que fomentan pensamientos lujuriosos?"] },
      { commandment: "10.º — No codiciarás los bienes ajenos.", questions: ["¿He envidiado lo que otros tienen?", "¿He sido avaro o materialista?", "¿He sido ingrato por las bendiciones de Dios?", "¿He puesto mi felicidad en las posesiones en lugar de en Dios?", "¿He resentido el éxito o la buena fortuna de otros?"] },
    ],
    examenSteps: [
      { title: "Presencia de Dios", icon: "✦", instruction: "Quédate quieto. Respira profundamente. Dios está aquí contigo ahora mismo — no como un observador distante, sino como un Padre amoroso sentado a tu lado.", prompt: "\"Señor, creo que estás aquí. Ayúdame a ver este día con tus ojos.\"", questions: ["Toma 30 segundos de silencio. Respira. Deja que el ruido del día se desvanezca."] },
      { title: "Gratitud", icon: "♡", instruction: "Recorre tu día desde el momento en que te despertaste. ¿Qué regalos te dio Dios hoy? Pueden ser pequeños — una taza de café caliente, una palabra amable, el sol.", prompt: "\"Todo don bueno y perfecto viene de lo alto.\" — St 1,17", questions: ["¿Qué momento de hoy te trajo alegría o paz?", "¿Por qué persona de hoy estás agradecido?", "¿Qué bendición simple quizás pasaste por alto?"] },
      { title: "Revisión del día", icon: "◈", instruction: "Como viendo una película de tu día, déjala reproducir. ¿Dónde te sentiste atraído hacia Dios (consolación)? ¿Dónde te sentiste alejado (desolación)?", prompt: "No juzgues — solo observa, con Dios a tu lado.", questions: ["¿Cuándo te sentiste más vivo, alegre o en paz hoy?", "¿Cuándo te sentiste más agotado, ansioso o distante de Dios?", "¿Hubo un momento en que sentiste la presencia de Dios?", "¿Hubo un momento en que ignoraste el suave impulso de Dios?"] },
      { title: "Dolor y perdón", icon: "✝", instruction: "Con gran ternura, mira los momentos en que fallaste. Dios ya lo sabe — Él es misericordioso. Llévale estos momentos como un niño lleva un juguete roto a sus padres.", prompt: "\"Aunque vuestros pecados sean como la escarlata, quedarán blancos como la nieve.\" — Is 1,18", questions: ["¿Dónde fallé en amar hoy?", "¿Pequé en pensamiento, palabra, obra u omisión?", "¿Hay alguien a quien necesito perdonar — incluido yo mismo?"] },
      { title: "Gracia para mañana", icon: "☀", instruction: "Mira hacia mañana. ¿Qué desafíos te esperan? Pide a Dios las gracias específicas que necesitarás.", prompt: "\"Sus misericordias son nuevas cada mañana.\" — Lm 3,23", questions: ["¿Qué necesitas más de Dios mañana?", "¿Hay una situación específica donde necesitas su ayuda?", "Termina con un Padre Nuestro y pon mañana en las manos de Dios."] },
    ],
    prayerLibrary: [
      { nameKey: "essentialPrayers", prayers: [
        { title: "Padre Nuestro", textKey: "ourFather" },
        { title: "Ave María", textKey: "hailMary" },
        { title: "Gloria al Padre", textKey: "gloryBe" },
        { title: "Acto de contrición", textKey: "actOfContrition" },
        { title: "Credo de los Apóstoles", textKey: "creed" },
      ]},
      { nameKey: "marianPrayers", prayers: [
        { title: "Memorare (Acuérdate)", text: "Acuérdate, oh piadosísima Virgen María,\nque jamás se ha oído decir\nque ninguno de los que han acudido a tu protección,\nimplorado tu asistencia o reclamado tu intercesión,\nhaya sido abandonado.\nAnimado por esta confianza,\na ti acudo, oh Madre, Virgen de las vírgenes,\ny gimiendo bajo el peso de mis pecados\nme atrevo a comparecer ante ti.\nOh Madre del Verbo,\nno deseches mis súplicas,\nantes bien, escúchalas y acógelas benignamente.\nAmén." },
        { title: "Salve", textKey: "hailHolyQueen" },
        { title: "El Ángelus", text: "V. El ángel del Señor anunció a María,\nR. Y concibió por obra del Espíritu Santo.\nDios te salve, María...\n\nV. He aquí la esclava del Señor,\nR. Hágase en mí según tu palabra.\nDios te salve, María...\n\nV. Y el Verbo se hizo carne,\nR. Y habitó entre nosotros.\nDios te salve, María...\n\nOremos: Derrama, Señor, tu gracia en nuestras almas,\npara que los que hemos conocido por el anuncio del ángel\nla encarnación de tu Hijo,\nlleguemos, por su pasión y su cruz,\na la gloria de la resurrección.\nPor el mismo Cristo nuestro Señor.\nAmén." },
      ]},
      { nameKey: "prayersOfSaints", prayers: [
        { title: "Oración por la paz — San Francisco", text: "Señor, haz de mí un instrumento de tu paz.\nDonde haya odio, siembre yo amor;\ndonde haya injuria, perdón;\ndonde haya duda, fe;\ndonde haya desesperación, esperanza;\ndonde haya tinieblas, luz;\ndonde haya tristeza, alegría.\n\nOh Divino Maestro,\nconcédeme que no busque tanto\nser consolado, como consolar;\nser comprendido, como comprender;\nser amado, como amar.\nPorque dando se recibe,\nperdonando se es perdonado,\ny muriendo se nace a la vida eterna.\nAmén." },
        { title: "Suscipe — San Ignacio", text: "Toma, Señor, y recibe\ntoda mi libertad, mi memoria,\nmi entendimiento y toda mi voluntad,\ntodo mi haber y mi poseer.\nTú me lo diste, a ti te lo torno.\nTodo es tuyo: dispón de ello según tu voluntad.\nDame tu amor y tu gracia,\nque ésta me basta.\nAmén." },
        { title: "Oración a San Miguel", text: "San Miguel Arcángel,\ndefiéndenos en la batalla.\nSé nuestro amparo contra la perversidad y asechanzas del demonio.\nReprímale Dios, pedimos suplicantes,\ny tú, Príncipe de la milicia celestial,\narroja al infierno con el divino poder\na Satanás y a los otros espíritus malignos\nque andan dispersos por el mundo\npara la perdición de las almas.\nAmén." },
        { title: "Anima Christi", text: "Alma de Cristo, santifícame.\nCuerpo de Cristo, sálvame.\nSangre de Cristo, embriágame.\nAgua del costado de Cristo, lávame.\nPasión de Cristo, confórtame.\nOh buen Jesús, óyeme.\nDentro de tus llagas, escóndeme.\nNo permitas que me aparte de ti.\nDel maligno enemigo, defiéndeme.\nEn la hora de mi muerte, llámame.\nY mándame ir a ti,\npara que con tus santos te alabe\npor los siglos de los siglos.\nAmén." },
      ]},
      { nameKey: "dailyPrayers", prayers: [
        { title: "Ofrenda matutina", text: "Oh Jesús, por el Inmaculado Corazón de María,\nte ofrezco mis oraciones, obras, alegrías y sufrimientos de este día,\npor todas las intenciones de tu Sagrado Corazón,\nen unión con el Santo Sacrificio de la Misa en todo el mundo,\npor la salvación de las almas, la reparación de los pecados,\nla reunión de todos los cristianos,\ny en particular por las intenciones del Santo Padre este mes.\nAmén." },
        { title: "Ángel de la guarda", text: "Ángel de Dios,\nque eres mi custodio,\nya que la bondad divina me ha confiado a ti,\nilumíname, guárdame, rígeme y gobiérname.\nAmén." },
        { title: "Bendición de la mesa", text: "Bendícenos, Señor,\ny bendice estos dones\nque por tu bondad vamos a recibir,\npor Cristo nuestro Señor.\nAmén." },
        { title: "Oración de la noche", text: "Visita, Señor, esta casa\ny aleja de ella todas las asechanzas del enemigo.\nQue tus santos ángeles habiten en ella\ny nos guarden en paz,\ny que tu bendición esté siempre sobre nosotros.\nPor Jesucristo nuestro Señor.\nAmén.\n\nVela, Señor, con los que velan o lloran esta noche,\ny da a tus ángeles y santos el encargo de los que duermen.\nCuida a tus enfermos, Señor Cristo.\nDescansa a tus fatigados.\nBendice a tus moribundos.\nConsuela a tus dolientes.\nProtege a tus alegres.\nY todo por amor a ti.\nAmén." },
      ]},
    ],
    saintsQuotes: [
      { quote: "Sé quien Dios quiso que fueras y prenderás fuego al mundo.", saint: "Santa Catalina de Siena" },
      { quote: "Reza, espera y no te preocupes.", saint: "San Pío de Pietrelcina" },
      { quote: "Haz cosas pequeñas con gran amor.", saint: "Santa Teresa de Calcuta" },
      { quote: "Nos has hecho para ti, Señor, y nuestro corazón está inquieto hasta que descanse en ti.", saint: "San Agustín" },
      { quote: "La alegría es la señal más segura de la presencia de Dios.", saint: "Santa Teresa de Ávila" },
      { quote: "Ten paciencia con todas las cosas, pero sobre todo contigo mismo.", saint: "San Francisco de Sales" },
      { quote: "No somos la suma de nuestras debilidades y fallos; somos la suma del amor del Padre por nosotros.", saint: "San Juan Pablo II" },
      { quote: "Enamórate, permanece en el amor, y eso lo decidirá todo.", saint: "P. Pedro Arrupe, S.J." },
    ],
  };
}

// ─── Spanish (Spain) ─────────────────────────────────────────────────────
const esES = {
  common: {
    demoUserName: "Peregrino",
    signOut: "Cerrar sesión",
    signInWithGoogle: "Iniciar sesión con Google",
    back: "←",
    returnHome: "Volver al inicio",
    continue: "Continuar →",
    next: "Siguiente →",
    summary: "Resumen",
    complete: "Completar ✝",
    completeExamen: "Completar ✦",
    saving: "Guardando...",
    loading: "Cargando...",
    syncing: "Sincronizando...",
    allPrayers: "← Todas las oraciones",
    saveReflection: "Guardar reflexión",
    clearJournal: "Vaciar diario",
    today: "Hoy",
  },
  home: {
    tagline: "Compañero espiritual católico",
    documentTitle: "Lumen — Compañero espiritual católico",
    disclaimer: "Una herramienta para rezar, no un sustituto de los sacramentos.",
    amdg: "Ad Maiorem Dei Gloriam.",
    holyRosary: "Santo Rosario",
    holyRosaryDesc: "Rosario tradicional completo con Letanías de Loreto",
    dailyExamen: "Examen diario",
    dailyExamenDesc: "Oración de 5 pasos de san Ignacio con reflexión",
    confessionPrep: "Preparación para confesión",
    confessionPrepDesc: "Examen de conciencia — 10 Mandamientos",
    prayerLibrary: "Oraciones",
    prayerLibraryDesc: "Oraciones católicas esenciales para cada momento",
    prayerJournal: "Diario de oración",
    prayerJournalDescSynced: "Sincronizado para {name} — en todos tus dispositivos",
    prayerJournalDescGuest: "Inicia sesión para sincronizar entre dispositivos",
  },
  footer: {
    language: "Idioma",
    english: "English",
    spanish: "Español",
  },
  rosary: {
    title: "Santo Rosario",
    chooseMysteries: "Elige los misterios",
    todayMysteries: "Misterios de hoy:",
    rosaryComplete: "Rosario completado",
    amen: "Amén.",
    mayTheyRest: "Descanse en paz, por la misericordia de Dios, el alma de los fieles difuntos. Amén.",
    openingPrayers: "Oraciones iniciales",
    closingPrayers: "Oraciones finales",
    decadeOf: "Década {n} de 5",
    litanyOfLoreto: "Letanías de Loreto",
    forIntentionsOfHolyFather: "Por las intenciones del Santo Padre",
    meditatingOn: "Meditando:",
    fruit: "Fruto:",
    mysteryOrdinals: ["1.ª", "2.ª", "3.ª", "4.ª", "5.ª"],
    hailMaryDecade: "Ave María {n}/10",
  },
  confession: {
    title: "Examen de conciencia",
    subtitle: "Mandamiento {current}/10 · {count} marcados",
    summaryTitle: "Resumen para la confesión",
    summarySubtitle: "{count} punto",
    summarySubtitlePlural: "{count} puntos",
    quote: "\"Hay más alegría en el cielo por un solo pecador que se arrepiente...\"",
    quoteRef: "— Lc 15,7",
    noItemsChecked: "Nada marcado. La confesión habitual sigue siendo una gran fuente de gracia.",
    actOfContrition: "Acto de contrición",
  },
  examen: {
    title: "Examen diario",
    savingReflections: "Guardando...",
    savingYourReflections: "Guardando tus reflexiones...",
    completeTitle: "Examen completado",
    wellDone: "Bien hecho",
    reflectionsSaved: "Tus reflexiones se han guardado en tu diario. ✓",
    step: "Paso {n}/5",
    yourReflections: "Tus reflexiones...",
  },
  prayers: {
    title: "Oraciones",
    essentialPrayers: "Oraciones esenciales",
    marianPrayers: "Oraciones marianas",
    prayersOfSaints: "Oraciones de los santos",
    dailyPrayers: "Oraciones del día",
  },
  journal: {
    title: "Diario de oración",
    signInTitle: "Inicia sesión para usar tu diario",
    signInDesc: "Tus reflexiones se sincronizarán en todos tus dispositivos al iniciar sesión con Google.",
    placeholder: "Escribe una reflexión, intención de oración o idea...",
    entriesCount: "{n} entrada",
    entriesCountPlural: "s",
    entriesCountSingular: "",
    emptyTitle: "Tu diario está vacío",
    emptyDesc: "Aquí aparecerán las reflexiones del examen y tus notas.",
    typeExamen: "🕯️ Examen",
    typeReflection: "✍️ Reflexión",
  },
  mysteries: {
    Joyful: "Gozosos",
    Sorrowful: "Dolorosos",
    Glorious: "Gloriosos",
    Luminous: "Luminosos",
    dayMondaySaturday: "Lunes y sábado",
    dayTuesdayFriday: "Martes y viernes",
    dayWednesdaySunday: "Miércoles y domingo",
    dayThursday: "Jueves",
  },
  content: getEsContent(),
};

const messages = {
  [LOCALES.EN_US]: enUS,
  [LOCALES.ES_ES]: esES,
};

/**
 * Get the full translations object for a locale.
 * Content (prayers, litany, mysteries, etc.) falls back to English if locale has no content.
 * @param {string} locale - One of LOCALES.EN_US, LOCALES.ES_ES
 * @returns {typeof enUS}
 */
export function getTranslations(locale) {
  const m = messages[locale] || messages[DEFAULT_LOCALE];
  const def = messages[DEFAULT_LOCALE];
  return {
    ...m,
    content: m.content !== undefined ? m.content : def.content,
  };
}

/**
 * Resolve a nested key like "home.tagline" from the translations object.
 * @param {object} t - Result of getTranslations(locale)
 * @param {string} key - Dot-separated key, e.g. "home.tagline"
 * @param {Record<string, string|number>} [params] - Optional replacements, e.g. { name: "John" } for "{name}"
 * @returns {string}
 */
export function tKey(t, key, params = {}) {
  const value = key.split(".").reduce((obj, k) => obj?.[k], t);
  if (typeof value !== "string") return key;
  return Object.entries(params).reduce(
    (s, [k, v]) => s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
    value
  );
}
