import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// LUMEN — Catholic Spiritual Companion
// 100% Free · Google Auth · n8n Journal Sync
// ═══════════════════════════════════════════════════════

// ┌─────────────────────────────────────────────────────┐
// │  CONFIGURATION — Replace these with your values     │
// └─────────────────────────────────────────────────────┘
const CONFIG = {
  GOOGLE_CLIENT_ID: "959675340296-t0vdupimbdtr5mvalimr1mdu0cuqu2tq.apps.googleusercontent.com",
  N8N_SAVE_WEBHOOK: "https://n8n.monk.st/webhook/lumen-journal-save",
  N8N_LOAD_WEBHOOK: "https://n8n.monk.st/webhook/lumen-journal-load",
};

// ═══════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════

const VIEWS = { HOME: "home", ROSARY: "rosary", ROSARY_PRAY: "rosary_pray", CONFESSION: "confession", EXAMEN: "examen", PRAYERS: "prayers", JOURNAL: "journal" };

const MYSTERIES = {
  Joyful: {
    day: "Monday & Saturday", color: "#6BA368",
    mysteries: [
      { title: "The Annunciation", fruit: "Humility", scripture: "The angel said to her, 'Do not be afraid, Mary, for you have found favor with God.' — Luke 1:30", meditation: "Mary's humble 'yes' changed the course of human history. In this moment, Heaven touched Earth. She did not understand everything, but she trusted completely. Consider: where is God asking you to say 'yes' today, even without seeing the full picture?" },
      { title: "The Visitation", fruit: "Love of Neighbor", scripture: "When Elizabeth heard Mary's greeting, the infant leaped in her womb. — Luke 1:41", meditation: "Mary, newly pregnant with the Savior, did not rest — she went in haste to serve her elderly cousin. Joy and charity are inseparable. Who in your life needs you to 'go in haste' to them today?" },
      { title: "The Nativity", fruit: "Poverty of Spirit", scripture: "She wrapped him in swaddling clothes and laid him in a manger, because there was no room for them in the inn. — Luke 2:7", meditation: "The King of Kings chose to enter the world in radical poverty, vulnerability, and silence. God comes not in power but in littleness. Where do you need to let go of worldly attachments to make room for Christ?" },
      { title: "The Presentation", fruit: "Obedience", scripture: "A sword will pierce your own soul too. — Luke 2:35", meditation: "Mary and Joseph faithfully obeyed the Law, presenting Jesus at the Temple. There, Simeon prophesied both glory and suffering. Faithfulness to God does not exempt us from pain — but gives it meaning." },
      { title: "Finding in the Temple", fruit: "Joy in Finding Jesus", scripture: "Why were you searching for me? Did you not know I must be in my Father's house? — Luke 2:49", meditation: "Even Mary and Joseph experienced the anguish of losing Jesus. After three days of searching, they found Him in the Temple. When you feel distant from God, keep searching — He is always in His Father's house, waiting for you." },
    ],
  },
  Sorrowful: {
    day: "Tuesday & Friday", color: "#8B3A3A",
    mysteries: [
      { title: "The Agony in the Garden", fruit: "Sorrow for Sin", scripture: "Father, if you are willing, take this cup from me; yet not my will, but yours be done. — Luke 22:42", meditation: "Jesus experienced the full weight of human suffering — fear, loneliness, abandonment. He sweat blood knowing what lay ahead. Yet He chose the Father's will over His own comfort. In your darkest moments, unite your suffering to His." },
      { title: "The Scourging at the Pillar", fruit: "Mortification", scripture: "By his wounds we are healed. — Isaiah 53:5", meditation: "Every lash upon Christ's body was an act of love for you, personally. He endured this not because He had to, but because He wanted to — for your sake. This is the depth of divine love: it holds nothing back." },
      { title: "The Crowning with Thorns", fruit: "Courage", scripture: "They wove a crown of thorns and placed it on his head, and mocked him saying, 'Hail, King of the Jews!' — Matthew 27:29", meditation: "The world mocked Christ's kingship with thorns. Today, the world still mocks faith, virtue, and holiness. Do you have the courage to wear your faith openly, even when it brings ridicule?" },
      { title: "The Carrying of the Cross", fruit: "Patience", scripture: "Whoever wishes to come after me must deny himself, take up his cross, and follow me. — Matthew 16:24", meditation: "Jesus fell three times but rose each time. Simon of Cyrene was called to help carry the cross — we too are called to help carry each other's burdens. What cross are you carrying? Who might help you bear it?" },
      { title: "The Crucifixion", fruit: "Self-Denial", scripture: "Father, forgive them, for they know not what they do. — Luke 23:34", meditation: "From the Cross, Jesus forgave His executioners, comforted a thief, and entrusted His mother to us. Even in death, He gave everything. There is no suffering beyond His reach, no sin beyond His mercy." },
    ],
  },
  Glorious: {
    day: "Wednesday & Sunday", color: "#BF9B30",
    mysteries: [
      { title: "The Resurrection", fruit: "Faith", scripture: "He is not here; he has risen, just as he said. — Matthew 28:6", meditation: "Death could not hold Him. The stone was rolled away not so Christ could get out, but so we could look in and see — the tomb is empty. Every fear, every failure, every ending in your life is subject to the power of the Resurrection." },
      { title: "The Ascension", fruit: "Hope", scripture: "I am with you always, until the end of the age. — Matthew 28:20", meditation: "Christ ascended to prepare a place for you. He did not leave us orphans — He sent the Spirit and remains truly present in the Eucharist. Our true home is Heaven." },
      { title: "The Descent of the Holy Spirit", fruit: "Wisdom", scripture: "They were all filled with the Holy Spirit and began to speak in different tongues. — Acts 2:4", meditation: "Fearful apostles became fearless evangelists in an instant. The same Spirit lives in you through Baptism and Confirmation. Ask the Holy Spirit right now: 'Come, and set me on fire.'" },
      { title: "The Assumption of Mary", fruit: "Grace of a Happy Death", scripture: "Blessed is she who believed that what was spoken to her by the Lord would be fulfilled. — Luke 1:45", meditation: "Mary, the first and most faithful disciple, was assumed body and soul into Heaven — a promise of what awaits all who follow her Son." },
      { title: "The Coronation of Mary", fruit: "Trust in Mary's Intercession", scripture: "A great sign appeared in the sky, a woman clothed with the sun, with the moon under her feet. — Revelation 12:1", meditation: "Mary reigns as Queen of Heaven — not by power, but by love and service. She is our Mother, given to us from the Cross. Run to her with confidence." },
    ],
  },
  Luminous: {
    day: "Thursday", color: "#4A90D9",
    mysteries: [
      { title: "The Baptism in the Jordan", fruit: "Openness to the Holy Spirit", scripture: "This is my beloved Son, with whom I am well pleased. — Matthew 3:17", meditation: "At His baptism, the Trinity was fully revealed. In your own Baptism, God spoke these same words over you. You are His beloved." },
      { title: "The Wedding at Cana", fruit: "To Jesus Through Mary", scripture: "His mother said to the servants, 'Do whatever he tells you.' — John 2:5", meditation: "Mary noticed the need before anyone else and brought it to Jesus. This is what she does for us still: she notices our needs and whispers, 'Do whatever He tells you.'" },
      { title: "The Proclamation of the Kingdom", fruit: "Repentance and Trust in God", scripture: "The kingdom of God is at hand. Repent, and believe in the gospel. — Mark 1:15", meditation: "Jesus proclaimed a kingdom built on mercy, forgiveness, and love of enemies. This kingdom is not someday; it is now, in every act of charity." },
      { title: "The Transfiguration", fruit: "Desire for Holiness", scripture: "His face shone like the sun, and his clothes became white as light. — Matthew 17:2", meditation: "On Mount Tabor, the apostles saw Christ's glory unveiled. God gives us consolations not as rewards but as fuel for the difficult road." },
      { title: "The Institution of the Eucharist", fruit: "Adoration", scripture: "This is my body, which will be given for you; do this in memory of me. — Luke 22:19", meditation: "The greatest miracle happens at every Mass. God loved you so much that He found a way to remain physically present with you until the end of time." },
    ],
  },
};

const PRAYERS = {
  signOfCross: "In the name of the Father, and of the Son, and of the Holy Spirit. Amen.",
  creed: "I believe in God, the Father Almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord; who was conceived by the Holy Spirit, born of the Virgin Mary; suffered under Pontius Pilate, was crucified, died, and was buried. He descended into hell; the third day He rose again from the dead; He ascended into heaven, and is seated at the right hand of God the Father Almighty; from thence He shall come to judge the living and the dead. I believe in the Holy Spirit, the Holy Catholic Church, the communion of Saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.",
  ourFather: "Our Father, who art in heaven, hallowed be Thy name. Thy kingdom come, Thy will be done, on earth as it is in heaven. Give us this day our daily bread, and forgive us our trespasses, as we forgive those who trespass against us. And lead us not into temptation, but deliver us from evil. Amen.",
  hailMary: "Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.",
  gloryBe: "Glory be to the Father, and to the Son, and to the Holy Spirit, as it was in the beginning, is now, and ever shall be, world without end. Amen.",
  fatima: "O my Jesus, forgive us our sins, save us from the fires of hell, and lead all souls to Heaven, especially those in most need of Thy mercy. Amen.",
  hailHolyQueen: "Hail, Holy Queen, Mother of Mercy, our life, our sweetness, and our hope! To thee do we cry, poor banished children of Eve. To thee do we send up our sighs, mourning and weeping in this valley of tears. Turn, then, most gracious advocate, thine eyes of mercy toward us, and after this our exile, show unto us the blessed fruit of thy womb, Jesus. O clement, O loving, O sweet Virgin Mary!\n\nV. Pray for us, O Holy Mother of God.\nR. That we may be made worthy of the promises of Christ.",
  closingPrayer: "Let us pray. O God, whose Only Begotten Son, by His life, Death, and Resurrection, has purchased for us the rewards of eternal life; grant, we beseech Thee, that by meditating upon these mysteries of the Most Holy Rosary of the Blessed Virgin Mary, we may imitate what they contain and obtain what they promise, through the same Christ our Lord. Amen.",
};

const LITANY_OF_LORETO = [
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
];

// Complete Rosary step sequence
const ROSARY_SEQUENCE = [
  { id: "sign_cross_1", type: "prayer", title: "Sign of the Cross", text: PRAYERS.signOfCross, beadLabel: "✝ Begin" },
  { id: "creed", type: "prayer", title: "Apostles' Creed", text: PRAYERS.creed, beadLabel: "Crucifix" },
  { id: "our_father_intro", type: "prayer", title: "Our Father", text: PRAYERS.ourFather, beadLabel: "1st Bead" },
  { id: "hm_faith", type: "prayer", title: "Hail Mary — For Faith", text: PRAYERS.hailMary, beadLabel: "Faith" },
  { id: "hm_hope", type: "prayer", title: "Hail Mary — For Hope", text: PRAYERS.hailMary, beadLabel: "Hope" },
  { id: "hm_charity", type: "prayer", title: "Hail Mary — For Charity", text: PRAYERS.hailMary, beadLabel: "Charity" },
  { id: "glory_be_intro", type: "prayer", title: "Glory Be", text: PRAYERS.gloryBe, beadLabel: "Glory Be" },
  // Decades inserted dynamically
  // After decades:
  { id: "hail_holy_queen", type: "prayer", title: "Hail, Holy Queen", text: PRAYERS.hailHolyQueen, beadLabel: "Closing" },
  { id: "litany", type: "litany", title: "Litany of Loreto", beadLabel: "Litany" },
  { id: "closing_prayer", type: "prayer", title: "Closing Prayer", text: PRAYERS.closingPrayer, beadLabel: "Prayer" },
  { id: "sign_cross_2", type: "prayer", title: "Sign of the Cross", text: PRAYERS.signOfCross, beadLabel: "✝ End" },
];

const COMMANDMENT_EXAM = [
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
];

const EXAMEN_STEPS = [
  { title: "God's Presence", icon: "✦", instruction: "Become still. Take a deep breath. God is here with you right now — not as a distant observer, but as a loving Father sitting beside you.", prompt: "\"Lord, I believe you are here. Help me see this day through your eyes.\"", questions: ["Take 30 seconds of silence. Breathe. Let the noise of the day fade."] },
  { title: "Gratitude", icon: "♡", instruction: "Walk through your day from the moment you woke up. What gifts did God give you today? They may be small — a warm cup of coffee, a kind word, sunshine.", prompt: "\"Every good and perfect gift is from above.\" — James 1:17", questions: ["What moment today brought you joy or peace?", "What person today were you grateful for?", "What simple blessing did you perhaps overlook?"] },
  { title: "Review of the Day", icon: "◈", instruction: "Like watching a movie of your day, let it replay. Where did you feel drawn toward God (consolation)? Where did you feel drawn away (desolation)?", prompt: "Don't judge — just notice, with God beside you.", questions: ["When did you feel most alive, joyful, or at peace today?", "When did you feel most drained, anxious, or distant from God?", "Was there a moment you felt God's presence?", "Was there a moment you ignored God's gentle nudge?"] },
  { title: "Sorrow & Forgiveness", icon: "✝", instruction: "With great tenderness, look at the moments where you fell short. God already knows — He is merciful. Bring these moments to Him like a child brings a broken toy to a parent.", prompt: "\"Though your sins are like scarlet, they shall be as white as snow.\" — Isaiah 1:18", questions: ["Where did you fail to love today?", "Did you sin in thought, word, deed, or omission?", "Is there someone you need to forgive — including yourself?"] },
  { title: "Grace for Tomorrow", icon: "☀", instruction: "Look ahead to tomorrow. What challenges await? Ask God for the specific graces you'll need.", prompt: "\"His mercies are new every morning.\" — Lamentations 3:23", questions: ["What do you need most from God tomorrow?", "Is there a specific situation where you need His help?", "Close with an Our Father and place tomorrow in God's hands."] },
];

const PRAYER_CATS = [
  { name: "Essential Prayers", prayers: [
    { title: "Our Father", text: PRAYERS.ourFather }, { title: "Hail Mary", text: PRAYERS.hailMary }, { title: "Glory Be", text: PRAYERS.gloryBe },
    { title: "Act of Contrition", text: "O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen." },
    { title: "Apostles' Creed", text: PRAYERS.creed },
  ]},
  { name: "Marian Prayers", prayers: [
    { title: "Memorare", text: "Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to thy protection, implored thy help, or sought thy intercession was left unaided. Inspired by this confidence, I fly unto thee, O Virgin of virgins, my mother; to thee do I come, before thee I stand, sinful and sorrowful. O Mother of the Word Incarnate, despise not my petitions, but in thy mercy hear and answer me. Amen." },
    { title: "Hail, Holy Queen", text: PRAYERS.hailHolyQueen },
    { title: "Angelus", text: "V. The Angel of the Lord declared unto Mary,\nR. And she conceived of the Holy Spirit.\nHail Mary...\n\nV. Behold the handmaid of the Lord,\nR. Be it done unto me according to thy word.\nHail Mary...\n\nV. And the Word was made flesh,\nR. And dwelt among us.\nHail Mary...\n\nPour forth, we beseech Thee, O Lord, Thy grace into our hearts, that we, to whom the Incarnation of Christ Thy Son was made known by the message of an Angel, may by His Passion and Cross be brought to the glory of His Resurrection. Through the same Christ our Lord. Amen." },
  ]},
  { name: "Prayers of the Saints", prayers: [
    { title: "Prayer of St. Francis", text: "Lord, make me an instrument of your peace.\nWhere there is hatred, let me sow love;\nWhere there is injury, pardon;\nWhere there is doubt, faith;\nWhere there is despair, hope;\nWhere there is darkness, light;\nWhere there is sadness, joy.\n\nO Divine Master, grant that I may not so much seek\nTo be consoled as to console;\nTo be understood as to understand;\nTo be loved as to love.\nFor it is in giving that we receive;\nIt is in pardoning that we are pardoned;\nAnd it is in dying that we are born to eternal life. Amen." },
    { title: "Suscipe — St. Ignatius", text: "Take, Lord, and receive all my liberty, my memory, my understanding, and my entire will, all I have and call my own. You have given all to me. To you, Lord, I return it. Everything is yours; do with it what you will. Give me only your love and your grace — that is enough for me." },
    { title: "St. Michael Prayer", text: "Saint Michael the Archangel, defend us in battle. Be our protection against the wickedness and snares of the devil. May God rebuke him, we humbly pray, and do thou, O Prince of the heavenly hosts, by the power of God, cast into hell Satan, and all the evil spirits, who prowl about the world seeking the ruin of souls. Amen." },
    { title: "Anima Christi", text: "Soul of Christ, sanctify me.\nBody of Christ, save me.\nBlood of Christ, inebriate me.\nWater from the side of Christ, wash me.\nPassion of Christ, strengthen me.\nO good Jesus, hear me.\nWithin Thy wounds hide me.\nSuffer me not to be separated from Thee.\nFrom the malignant enemy defend me.\nIn the hour of my death call me.\nAnd bid me come unto Thee.\nThat I may praise Thee with Thy saints\nand with Thy angels, forever and ever. Amen." },
  ]},
  { name: "Daily Prayers", prayers: [
    { title: "Morning Offering", text: "O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day, for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, for the salvation of souls, the reparation of sins, the reunion of all Christians, and in particular for the intentions of the Holy Father this month. Amen." },
    { title: "Guardian Angel Prayer", text: "Angel of God, my guardian dear, to whom God's love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen." },
    { title: "Grace Before Meals", text: "Bless us, O Lord, and these Thy gifts, which we are about to receive from Thy bounty, through Christ our Lord. Amen." },
    { title: "Night Prayer", text: "Visit, we beseech Thee, O Lord, this dwelling, and drive far from it all snares of the enemy. Let Thy holy angels dwell herein, to preserve us in peace; and let Thy blessing be upon us, through Jesus Christ our Lord. Amen.\n\nWatch, O Lord, with those who wake, or watch, or weep tonight, and give Your angels and saints charge over those who sleep. Tend Your sick ones, O Lord Christ. Rest Your weary ones. Bless Your dying ones. Soothe Your suffering ones. Shield Your joyous ones. And all for Your love's sake. Amen." },
  ]},
];

const SAINTS_QUOTES = [
  { quote: "Be who God meant you to be and you will set the world on fire.", saint: "St. Catherine of Siena" },
  { quote: "Pray, hope, and don't worry.", saint: "St. Padre Pio" },
  { quote: "Do small things with great love.", saint: "St. Teresa of Calcutta" },
  { quote: "You have made us for yourself, O Lord, and our hearts are restless until they rest in you.", saint: "St. Augustine" },
  { quote: "Joy is the surest sign of the presence of God.", saint: "St. Teresa of Ávila" },
  { quote: "Have patience with all things, but first of all with yourself.", saint: "St. Francis de Sales" },
  { quote: "We are not the sum of our weaknesses and failures; we are the sum of the Father's love for us.", saint: "St. John Paul II" },
  { quote: "Fall in love, stay in love, and it will decide everything.", saint: "Fr. Pedro Arrupe, S.J." },
];

// ═══════════════════════════════════════════════════════
// STYLES & SHARED
// ═══════════════════════════════════════════════════════
const S = {
  bg: "linear-gradient(170deg, #0d1117 0%, #151d2b 30%, #1a2238 60%, #0f1923 100%)",
  gold: "#BF9B30", goldLight: "#E8D48B", text: "#f5ecd7", textDim: "rgba(245,236,215,0.55)",
  cardBg: "rgba(255,248,235,0.04)", borderDim: "rgba(191,155,48,0.15)",
  heading: "'Cormorant Garamond', serif", body: "'Lora', serif",
};

function CrossIcon({ size = 24, color = "currentColor" }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="10" y="2" width="4" height="20" rx="0.5" fill={color}/><rect x="4" y="7" width="16" height="4" rx="0.5" fill={color}/></svg>;
}

function Header({ title, subtitle, onBack, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${S.borderDim}`, background: "rgba(13,17,23,0.92)", backdropFilter: "blur(20px)", flexShrink: 0, gap: 14, position: "sticky", top: 0, zIndex: 10 }}>
      <button onClick={onBack} style={{ background: "none", border: "1px solid rgba(191,155,48,0.25)", borderRadius: 10, padding: "7px 13px", cursor: "pointer", color: S.gold, fontSize: 14, fontFamily: S.body }}>←</button>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontFamily: S.heading, fontSize: 20, fontWeight: 500, color: S.gold, letterSpacing: "0.04em" }}>{title}</h2>
        {subtitle && <p style={{ fontFamily: S.body, fontSize: 11, color: "rgba(245,236,215,0.38)", marginTop: 1 }}>{subtitle}</p>}
      </div>
      {right || <CrossIcon size={17} color="rgba(191,155,48,0.22)" />}
    </div>
  );
}

function ProgressBar({ total, current, color = S.gold }) {
  return <div style={{ display: "flex", padding: "10px 20px", gap: 4, flexShrink: 0 }}>{Array.from({ length: total }, (_, i) => <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i < current ? color : i === current ? `${color}66` : "rgba(191,155,48,0.1)", transition: "all 0.4s" }}/>)}</div>;
}

function Btn({ children, onClick, disabled, full, color }) {
  const bg = color || S.gold;
  return <button onClick={onClick} disabled={disabled} style={{ width: full ? "100%" : "auto", padding: "14px 28px", borderRadius: 13, border: "none", background: disabled ? "rgba(191,155,48,0.12)" : `linear-gradient(135deg, ${bg}, ${bg}cc)`, color: disabled ? "rgba(191,155,48,0.3)" : "#fff", fontFamily: S.heading, fontSize: 16, fontWeight: 600, cursor: disabled ? "default" : "pointer", letterSpacing: "0.04em", boxShadow: disabled ? "none" : `0 4px 16px ${bg}33` }}>{children}</button>;
}

function OutBtn({ children, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled} style={{ flex: 1, padding: "14px", borderRadius: 13, border: "1px solid rgba(191,155,48,0.2)", background: "transparent", color: disabled ? "rgba(191,155,48,0.18)" : S.gold, fontFamily: S.heading, fontSize: 16, fontWeight: 600, cursor: disabled ? "default" : "pointer" }}>{children}</button>;
}

// ═══════════════════════════════════════════════════════
// GOOGLE AUTH + N8N JOURNAL SYNC
// ═══════════════════════════════════════════════════════

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("lumen_user");
      if (cached) setUser(JSON.parse(cached));
    } catch {}
    setLoading(false);

    // Load Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (window.google && CONFIG.GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com") {
        window.google.accounts.id.initialize({
          client_id: CONFIG.GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
      }
    };
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch {} };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      // Decode JWT token (payload is the second part)
      const payload = JSON.parse(atob(response.credential.split(".")[1]));
      const userData = { id: payload.sub, name: payload.name, email: payload.email, picture: payload.picture };
      setUser(userData);
      try { localStorage.setItem("lumen_user", JSON.stringify(userData)); } catch {}
    } catch (e) { console.error("Auth error:", e); }
  };

  const signIn = () => {
    if (window.google && CONFIG.GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com") {
      window.google.accounts.id.prompt();
    } else {
      // Demo mode — create a local user
      const demo = { id: "local_user", name: "Pilgrim", email: "local", picture: null };
      setUser(demo);
      try { localStorage.setItem("lumen_user", JSON.stringify(demo)); } catch {};
    }
  };

  const signOut = () => {
    setUser(null);
    try { localStorage.removeItem("lumen_user"); } catch {}
  };

  return { user, loading, signIn, signOut };
}

function useJournal(user) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Load from n8n on login, fallback to local storage
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    (async () => {
      // Always load from localStorage first
      let localEntries = [];
      try {
        const r = localStorage.getItem(`lumen_journal_${user.id}`);
        if (r) localEntries = JSON.parse(r);
      } catch {}
      setEntries(localEntries);

      // Then try n8n for remote sync (merge if newer)
      if (CONFIG.N8N_LOAD_WEBHOOK !== "https://your-n8n-instance.com/webhook/lumen-journal-load") {
        try {
          const res = await fetch(CONFIG.N8N_LOAD_WEBHOOK, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, email: user.email }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data.entries && data.entries.length > localEntries.length) {
              setEntries(data.entries);
              try { localStorage.setItem(`lumen_journal_${user.id}`, JSON.stringify(data.entries)); } catch {}
            }
          }
        } catch {}
      }
      setLoading(false);
    })();
  }, [user]);

  const syncToN8n = async (updated) => {
    if (!user || CONFIG.N8N_SAVE_WEBHOOK === "https://your-n8n-instance.com/webhook/lumen-journal-save") return;
    setSyncing(true);
    try {
      await fetch(CONFIG.N8N_SAVE_WEBHOOK, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email, name: user.name, entries: updated }),
      });
    } catch {}
    setSyncing(false);
  };

  const addEntry = async (entry) => {
    const updated = [...entries, { ...entry, date: new Date().toISOString() }];
    setEntries(updated);
    try { localStorage.setItem(`lumen_journal_${user.id}`, JSON.stringify(updated)); } catch {}
    syncToN8n(updated);
  };

  const clearEntries = async () => {
    setEntries([]);
    try { localStorage.removeItem(`lumen_journal_${user.id}`); } catch {}
    syncToN8n([]);
  };

  return { entries, loading, syncing, addEntry, clearEntries };
}

// ═══════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════
function HomeScreen({ setView, user, signIn, signOut }) {
  const [qi] = useState(Math.floor(Math.random() * SAINTS_QUOTES.length));
  const q = SAINTS_QUOTES[qi];

  const Card = ({ title, icon, desc, onClick, delay }) => {
    const [h, setH] = useState(false);
    return (
      <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
        background: h ? "rgba(191,155,48,0.1)" : S.cardBg, border: `1px solid rgba(191,155,48,${h ? 0.38 : 0.15})`,
        borderRadius: 16, padding: "20px 16px", cursor: "pointer", textAlign: "left",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", transform: h ? "translateY(-2px)" : "none",
        boxShadow: h ? "0 8px 28px rgba(191,155,48,0.1)" : "none", animation: `fadeUp 0.5s ease-out ${delay}s both`,
        display: "flex", flexDirection: "column", gap: 7,
      }}>
        <span style={{ fontSize: 26 }}>{icon}</span>
        <span style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 600, color: S.gold }}>{title}</span>
        <span style={{ fontFamily: S.body, fontSize: 11.5, color: S.textDim, lineHeight: 1.45 }}>{desc}</span>
      </button>
    );
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", padding: "28px 20px", maxWidth: 560, margin: "0 auto" }}>
      {/* Auth bar */}
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", marginBottom: 8, animation: "fadeUp 0.4s ease-out" }}>
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: S.body, fontSize: 12, color: S.textDim }}>
              {user.picture && <img src={user.picture} style={{ width: 22, height: 22, borderRadius: "50%", verticalAlign: "middle", marginRight: 6 }} referrerPolicy="no-referrer" />}
              {user.name}
            </span>
            <button onClick={signOut} style={{ background: "none", border: "1px solid rgba(191,155,48,0.15)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", color: "rgba(245,236,215,0.35)", fontFamily: S.body, fontSize: 11 }}>Sign out</button>
          </div>
        ) : (
          <button onClick={signIn} style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8,
            padding: "7px 14px", cursor: "pointer", color: S.text, fontFamily: S.body, fontSize: 12.5,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Sign in with Google
          </button>
        )}
      </div>

      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 28, animation: "fadeUp 0.5s ease-out" }}>
        <div style={{ animation: "crossGlow 4s ease-in-out infinite, float 6s ease-in-out infinite", marginBottom: 12, display: "inline-block" }}>
          <CrossIcon size={40} color={S.gold} />
        </div>
        <h1 style={{
          fontFamily: S.heading, fontSize: 48, fontWeight: 300, letterSpacing: "0.15em", marginBottom: 4,
          background: `linear-gradient(135deg, ${S.gold} 0%, ${S.goldLight} 50%, ${S.gold} 100%)`, backgroundSize: "200% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 6s linear infinite",
        }}>LUMEN</h1>
        <p style={{ fontFamily: S.heading, fontSize: 12, letterSpacing: "0.25em", color: "rgba(191,155,48,0.45)", textTransform: "uppercase", marginBottom: 22 }}>Catholic Spiritual Companion</p>
        <div style={{ maxWidth: 360, margin: "0 auto", padding: "15px 18px", background: "rgba(191,155,48,0.04)", borderRadius: 11, borderLeft: "3px solid rgba(191,155,48,0.18)" }}>
          <p style={{ fontFamily: S.heading, fontSize: 15.5, fontStyle: "italic", lineHeight: 1.6, color: "rgba(245,236,215,0.68)", marginBottom: 4 }}>"{q.quote}"</p>
          <p style={{ fontFamily: S.body, fontSize: 11, color: "rgba(191,155,48,0.5)" }}>— {q.saint}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", marginBottom: 12 }}>
        <Card title="Holy Rosary" icon="📿" desc="Complete traditional Rosary with Litany of Loreto" onClick={() => setView(VIEWS.ROSARY)} delay={0.08} />
        <Card title="Daily Examen" icon="🕯️" desc="St. Ignatius's 5-step prayer with journaling" onClick={() => setView(VIEWS.EXAMEN)} delay={0.13} />
        <Card title="Confession Prep" icon="💧" desc="Examination of conscience — 10 Commandments" onClick={() => setView(VIEWS.CONFESSION)} delay={0.18} />
        <Card title="Prayer Library" icon="📖" desc="Essential Catholic prayers for every occasion" onClick={() => setView(VIEWS.PRAYERS)} delay={0.23} />
      </div>
      <div style={{ width: "100%", marginBottom: 24 }}>
        <Card title="Prayer Journal" icon="✍️" desc={user ? `Synced for ${user.name} — persists across devices` : "Sign in to sync across devices"} onClick={() => setView(VIEWS.JOURNAL)} delay={0.28} />
      </div>

      <p style={{ fontFamily: S.heading, fontSize: 11.5, color: "rgba(245,236,215,0.22)", textAlign: "center", lineHeight: 1.6, maxWidth: 300, animation: "fadeUp 0.5s ease-out 0.4s both" }}>
        A tool for prayer, not a replacement for the Sacraments.<br/><em>Ad Maiorem Dei Gloriam.</em>
      </p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ROSARY — COMPLETE TRADITIONAL STRUCTURE
// ═══════════════════════════════════════════════════════
function RosarySelect({ onSelect, onBack }) {
  const todayM = ["Glorious","Joyful","Sorrowful","Glorious","Luminous","Sorrowful","Joyful"][new Date().getDay()];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title="Holy Rosary" subtitle="Choose your mysteries" onBack={onBack} />
      <div style={{ padding: 20, maxWidth: 540, margin: "0 auto", width: "100%" }}>
        <p style={{ fontFamily: S.heading, fontSize: 15, color: S.textDim, textAlign: "center", marginBottom: 20, fontStyle: "italic" }}>
          Today's mysteries: <strong style={{ color: S.gold }}>{todayM}</strong>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {Object.entries(MYSTERIES).map(([name, d], i) => (
            <button key={name} onClick={() => onSelect(name)} style={{
              background: name === todayM ? `${d.color}15` : S.cardBg, border: `1px solid ${name === todayM ? d.color + "44" : S.borderDim}`,
              borderRadius: 13, padding: "18px 15px", cursor: "pointer", textAlign: "left", transition: "all 0.3s",
              animation: `fadeUp 0.4s ease-out ${i * 0.07}s both`,
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, marginBottom: 9, boxShadow: `0 0 10px ${d.color}44` }} />
              <div style={{ fontFamily: S.heading, fontSize: 18, fontWeight: 600, color: d.color, marginBottom: 2 }}>{name}</div>
              <div style={{ fontFamily: S.body, fontSize: 11, color: S.textDim }}>{d.day}</div>
              {name === todayM && <div style={{ fontFamily: S.body, fontSize: 10.5, color: d.color, marginTop: 5, fontWeight: 600 }}>★ Today</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RosaryPray({ mysterySet, onBack }) {
  const d = MYSTERIES[mysterySet];
  // Build full sequence: intro → 5 decades → closing
  const fullSteps = useRef(null);
  if (!fullSteps.current) {
    const steps = [];
    // 1. Opening
    steps.push({ type: "prayer", title: "Sign of the Cross", text: PRAYERS.signOfCross, section: "opening" });
    steps.push({ type: "prayer", title: "Apostles' Creed", text: PRAYERS.creed, section: "opening" });
    steps.push({ type: "prayer", title: "Our Father", text: PRAYERS.ourFather, section: "opening", note: "For the intentions of the Holy Father" });
    steps.push({ type: "prayer", title: "Hail Mary — For Faith", text: PRAYERS.hailMary, section: "opening" });
    steps.push({ type: "prayer", title: "Hail Mary — For Hope", text: PRAYERS.hailMary, section: "opening" });
    steps.push({ type: "prayer", title: "Hail Mary — For Charity", text: PRAYERS.hailMary, section: "opening" });
    steps.push({ type: "prayer", title: "Glory Be", text: PRAYERS.gloryBe, section: "opening" });
    // 2. Five Decades
    d.mysteries.forEach((m, mi) => {
      steps.push({ type: "mystery", title: m.title, fruit: m.fruit, scripture: m.scripture, meditation: m.meditation, decadeNum: mi + 1, section: "decade" });
      steps.push({ type: "prayer", title: "Our Father", text: PRAYERS.ourFather, section: "decade", decadeNum: mi + 1 });
      for (let hm = 1; hm <= 10; hm++) {
        steps.push({ type: "hail_mary", title: `Hail Mary ${hm}/10`, text: PRAYERS.hailMary, hmNum: hm, decadeNum: mi + 1, mysteryTitle: m.title, section: "decade" });
      }
      steps.push({ type: "prayer", title: "Glory Be", text: PRAYERS.gloryBe, section: "decade", decadeNum: mi + 1 });
      steps.push({ type: "prayer", title: "Fatima Prayer", text: PRAYERS.fatima, section: "decade", decadeNum: mi + 1 });
    });
    // 3. Closing
    steps.push({ type: "prayer", title: "Hail, Holy Queen", text: PRAYERS.hailHolyQueen, section: "closing" });
    steps.push({ type: "litany", title: "Litany of Loreto", section: "closing" });
    steps.push({ type: "prayer", title: "Closing Prayer", text: PRAYERS.closingPrayer, section: "closing" });
    steps.push({ type: "prayer", title: "Sign of the Cross", text: PRAYERS.signOfCross, section: "closing" });
    fullSteps.current = steps;
  }

  const [si, setSi] = useState(0);
  const steps = fullSteps.current;
  const totalSteps = steps.length;

  if (si >= totalSteps) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title="Rosary Complete" onBack={onBack} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 20, animation: "float 3s ease-in-out infinite" }}>📿</div>
          <h2 style={{ fontFamily: S.heading, fontSize: 28, color: S.gold, marginBottom: 16 }}>Amen.</h2>
          <p style={{ fontFamily: S.body, fontSize: 14, color: "rgba(245,236,215,0.6)", maxWidth: 400, lineHeight: 1.7 }}>
            May the souls of the faithful departed, through the mercy of God, rest in peace. Amen.
          </p>
          <div style={{ marginTop: 28 }}><Btn onClick={onBack} color={S.gold}>Return Home</Btn></div>
        </div>
      </div>
    );
  }

  const step = steps[si];
  const currentDecade = step.decadeNum || 0;
  const decadeProgress = steps.slice(0, si + 1).filter(s => s.type === "mystery").length;

  const getSectionLabel = () => {
    if (step.section === "opening") return "Opening Prayers";
    if (step.section === "closing") return "Closing Prayers";
    return `Decade ${currentDecade} of 5`;
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title={`${mysterySet} Mysteries`} subtitle={getSectionLabel()} onBack={onBack} />
      <ProgressBar total={5} current={decadeProgress} color={d.color} />

      {/* Hail Mary bead counter */}
      {step.type === "hail_mary" && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "10px 20px", flexShrink: 0 }}>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} style={{
              width: i < step.hmNum ? 11 : 8, height: i < step.hmNum ? 11 : 8, borderRadius: "50%",
              background: i < step.hmNum ? d.color : "rgba(191,155,48,0.12)",
              border: i + 1 === step.hmNum ? `2px solid ${d.color}` : "none",
              boxShadow: i + 1 === step.hmNum ? `0 0 8px ${d.color}44` : "none", transition: "all 0.3s",
            }} />
          ))}
        </div>
      )}

      {/* Content */}
      <div key={si} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 22px", textAlign: "center", overflow: "auto", animation: "fadeUp 0.3s ease-out" }}>
        {step.type === "mystery" ? (
          <>
            <div style={{ fontFamily: S.body, fontSize: 12, color: d.color, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
              {step.decadeNum}{["st","nd","rd","th","th"][step.decadeNum - 1]} Mystery — Fruit: {step.fruit}
            </div>
            <h3 style={{ fontFamily: S.heading, fontSize: 28, fontWeight: 500, color: d.color, marginBottom: 16 }}>{step.title}</h3>
            <p style={{ fontFamily: S.body, fontSize: 13.5, color: S.textDim, fontStyle: "italic", marginBottom: 14, maxWidth: 460, lineHeight: 1.6 }}>{step.scripture}</p>
            <p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(245,236,215,0.82)", lineHeight: 1.8, maxWidth: 480 }}>{step.meditation}</p>
          </>
        ) : step.type === "litany" ? (
          <div style={{ maxWidth: 480, width: "100%", textAlign: "left" }}>
            <h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.gold, marginBottom: 18, textAlign: "center" }}>Litany of Loreto</h3>
            <div style={{ maxHeight: 350, overflowY: "auto", paddingRight: 4 }}>
              {LITANY_OF_LORETO.map((line, i) => (
                <div key={i} style={{ marginBottom: 8, fontSize: 13, fontFamily: S.body, lineHeight: 1.5 }}>
                  <p style={{ color: "rgba(245,236,215,0.75)" }}>{line.v}</p>
                  <p style={{ color: S.gold, fontStyle: "italic", paddingLeft: 16 }}>{line.r}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: S.heading, fontSize: 25, fontWeight: 500, color: d.color, marginBottom: 14 }}>{step.title}</h3>
            {step.note && <p style={{ fontFamily: S.body, fontSize: 12.5, color: S.textDim, fontStyle: "italic", marginBottom: 10 }}>{step.note}</p>}
            {step.type === "hail_mary" && <p style={{ fontFamily: S.body, fontSize: 12, color: `${d.color}88`, marginBottom: 10 }}>Meditating on: {step.mysteryTitle}</p>}
            <p style={{ fontFamily: S.body, fontSize: 15.5, color: "rgba(245,236,215,0.85)", lineHeight: 1.8, maxWidth: 480, whiteSpace: "pre-line" }}>{step.text}</p>
          </>
        )}
      </div>

      {/* Navigation */}
      <div style={{ padding: "12px 20px 20px", display: "flex", gap: 10, flexShrink: 0 }}>
        <OutBtn onClick={() => setSi(Math.max(0, si - 1))} disabled={si === 0}>←</OutBtn>
        <div style={{ flex: 2 }}>
          <button onClick={() => si < totalSteps - 1 ? setSi(si + 1) : setSi(totalSteps)} style={{
            width: "100%", background: `linear-gradient(135deg, ${d.color}, ${d.color}cc)`, border: "none", borderRadius: 13,
            padding: "14px", cursor: "pointer", fontFamily: S.heading, fontSize: 16, fontWeight: 600, color: "#fff",
            boxShadow: `0 4px 14px ${d.color}33`,
          }}>
            {si < totalSteps - 1 ? "Continue →" : "Complete ✝"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CONFESSION PREP
// ═══════════════════════════════════════════════════════
function ConfessionPrep({ onBack }) {
  const [ci, setCi] = useState(0);
  const [checked, setChecked] = useState({});
  const [done, setDone] = useState(false);
  const toggle = (c, q) => { const k = `${c}-${q}`; setChecked(p => ({ ...p, [k]: !p[k] })); };
  const sinCount = Object.values(checked).filter(Boolean).length;

  if (done) {
    const sins = [];
    COMMANDMENT_EXAM.forEach((c, ci2) => c.questions.forEach((q, qi) => { if (checked[`${ci2}-${qi}`]) sins.push(q); }));
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title="Confession Summary" subtitle={`${sins.length} item${sins.length !== 1 ? "s" : ""}`} onBack={onBack} />
        <div style={{ flex: 1, padding: 20, maxWidth: 540, margin: "0 auto", width: "100%", overflow: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: 22, padding: 18, background: "rgba(191,155,48,0.04)", borderRadius: 12, borderLeft: "3px solid rgba(191,155,48,0.2)" }}>
            <p style={{ fontFamily: S.heading, fontSize: 17, color: S.gold, marginBottom: 5 }}>"There is more joy in heaven over one sinner who repents..."</p>
            <p style={{ fontFamily: S.body, fontSize: 11.5, color: S.textDim }}>— Luke 15:7</p>
          </div>
          {sins.length > 0 ? sins.map((s, i) => (
            <p key={i} style={{ fontFamily: S.body, fontSize: 13, color: "rgba(245,236,215,0.68)", marginBottom: 9, paddingLeft: 13, borderLeft: "2px solid rgba(191,155,48,0.15)", lineHeight: 1.5 }}>{s}</p>
          )) : <p style={{ fontFamily: S.body, fontSize: 13.5, color: S.textDim, textAlign: "center" }}>No items checked. Regular Confession is still a powerful source of grace.</p>}
          <div style={{ marginTop: 24, padding: 16, background: "rgba(139,58,58,0.07)", borderRadius: 12, border: "1px solid rgba(139,58,58,0.15)" }}>
            <h4 style={{ fontFamily: S.heading, fontSize: 16, color: "#d4a0a0", marginBottom: 8 }}>Act of Contrition</h4>
            <p style={{ fontFamily: S.body, fontSize: 13, color: "rgba(245,236,215,0.78)", lineHeight: 1.75 }}>O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen.</p>
          </div>
          <div style={{ marginTop: 18 }}><Btn full onClick={onBack} color={S.gold}>Return Home</Btn></div>
        </div>
      </div>
    );
  }

  const cmd = COMMANDMENT_EXAM[ci];
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title="Examination of Conscience" subtitle={`Commandment ${ci+1}/10 · ${sinCount} marked`} onBack={onBack} />
      <ProgressBar total={10} current={ci} />
      <div style={{ flex: 1, padding: 20, maxWidth: 540, margin: "0 auto", width: "100%", overflow: "auto" }}>
        <h3 key={ci} style={{ fontFamily: S.heading, fontSize: 19, color: S.gold, marginBottom: 16, lineHeight: 1.4, animation: "fadeUp 0.3s ease-out" }}>{cmd.commandment}</h3>
        {cmd.questions.map((q, qi) => {
          const on = checked[`${ci}-${qi}`];
          return (
            <button key={qi} onClick={() => toggle(ci, qi)} style={{
              display: "flex", alignItems: "flex-start", gap: 12, width: "100%", padding: "12px 14px", marginBottom: 8,
              background: on ? "rgba(139,58,58,0.08)" : S.cardBg, border: `1px solid ${on ? "rgba(139,58,58,0.25)" : S.borderDim}`,
              borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "all 0.2s",
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: 5, border: `2px solid ${on ? "#8B3A3A" : "rgba(191,155,48,0.2)"}`,
                background: on ? "#8B3A3A" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, marginTop: 1,
              }}>{on && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}</div>
              <span style={{ fontFamily: S.body, fontSize: 13.5, color: "rgba(245,236,215,0.75)", lineHeight: 1.5 }}>{q}</span>
            </button>
          );
        })}
      </div>
      <div style={{ padding: "12px 20px 20px", display: "flex", gap: 10, flexShrink: 0 }}>
        <OutBtn onClick={() => setCi(Math.max(0, ci-1))} disabled={ci === 0}>←</OutBtn>
        <div style={{ flex: 1.5 }}><Btn full onClick={() => ci < 9 ? setCi(ci+1) : setDone(true)} color={S.gold}>{ci < 9 ? "Next →" : "Summary"}</Btn></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DAILY EXAMEN
// ═══════════════════════════════════════════════════════
function DailyExamen({ onBack, addJournalEntry }) {
  const [si, setSi] = useState(0);
  const [notes, setNotes] = useState({});
  const saved = useRef(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (si >= EXAMEN_STEPS.length && !saved.current) {
      saved.current = true;
      setSaving(true);
      const noteValues = Object.values(notes).filter(Boolean);
      if (noteValues.length > 0) {
        // Build labeled notes with step titles
        const labeledNotes = {};
        EXAMEN_STEPS.forEach((step, i) => {
          if (notes[i]) labeledNotes[step.title] = notes[i];
        });
        const entry = { notes: labeledNotes, type: "examen" };
        if (addJournalEntry) {
          addJournalEntry(entry);
        } else {
          try {
            const r = localStorage.getItem("lumen_journal_guest");
            let entries = r ? JSON.parse(r) : [];
            entries.push({ ...entry, date: new Date().toISOString() });
            localStorage.setItem("lumen_journal_guest", JSON.stringify(entries));
          } catch {}
        }
      }
      setTimeout(() => setSaving(false), 1200);
    }
  }, [si]);

  if (si >= EXAMEN_STEPS.length) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title="Examen Complete" onBack={onBack} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 18, animation: "float 3s ease-in-out infinite" }}>🕯️</div>
          <h2 style={{ fontFamily: S.heading, fontSize: 26, color: S.gold, marginBottom: 8 }}>Well Done</h2>
          {saving ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 16, height: 16, border: "2px solid rgba(191,155,48,0.3)", borderTop: `2px solid ${S.gold}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <p style={{ fontFamily: S.body, fontSize: 13.5, color: S.gold }}>Saving reflections...</p>
            </div>
          ) : (
            <p style={{ fontFamily: S.body, fontSize: 13.5, color: "rgba(245,236,215,0.55)", maxWidth: 360, lineHeight: 1.7, marginBottom: 24 }}>Your reflections have been saved to your journal. ✓</p>
          )}
          <Btn onClick={onBack} color={S.gold}>Return Home</Btn>
        </div>
      </div>
    );
  }

  const s = EXAMEN_STEPS[si];
  const showTextarea = si > 0; // No textarea on step 1 (silence/presence)
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title="Daily Examen" subtitle={`Step ${si+1}/5 — ${s.title}`} onBack={onBack} />
      <div style={{ display: "flex", padding: "9px 20px", gap: 7, flexShrink: 0 }}>
        {EXAMEN_STEPS.map((x, i) => <div key={i} style={{ flex: 1, textAlign: "center", opacity: i === si ? 1 : 0.3, transition: "all 0.3s" }}><div style={{ fontSize: 16 }}>{x.icon}</div><div style={{ fontFamily: S.body, fontSize: 9, color: "rgba(245,236,215,0.5)" }}>{x.title}</div></div>)}
      </div>
      <div style={{ flex: 1, padding: "16px 22px", maxWidth: 540, margin: "0 auto", width: "100%", overflow: "auto" }}>
        <div key={si} style={{ animation: "fadeUp 0.3s ease-out" }}>
          <h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.gold, marginBottom: 9 }}>{s.icon} {s.title}</h3>
          <p style={{ fontFamily: S.body, fontSize: 14, color: "rgba(245,236,215,0.78)", lineHeight: 1.7, marginBottom: 12 }}>{s.instruction}</p>
          <p style={{ fontFamily: S.heading, fontSize: 14, fontStyle: "italic", color: "rgba(191,155,48,0.55)", marginBottom: 18, lineHeight: 1.5 }}>{s.prompt}</p>
          {s.questions.map((q, i) => <div key={i} style={{ padding: "9px 0", borderBottom: "1px solid rgba(191,155,48,0.06)" }}><p style={{ fontFamily: S.body, fontSize: 13.5, color: "rgba(245,236,215,0.55)", lineHeight: 1.5 }}>{q}</p></div>)}
          {showTextarea && <textarea placeholder="Your reflections..." value={notes[si] || ""} onChange={e => setNotes({ ...notes, [si]: e.target.value })}
            style={{ width: "100%", marginTop: 16, padding: "12px 14px", background: "rgba(255,248,235,0.04)", border: `1px solid ${S.borderDim}`, borderRadius: 10, color: S.text, fontFamily: S.body, fontSize: 16, lineHeight: 1.6, minHeight: 80, resize: "vertical" }} />}
        </div>
      </div>
      <div style={{ padding: "12px 20px 20px", display: "flex", gap: 10, flexShrink: 0 }}>
        <OutBtn onClick={() => setSi(Math.max(0, si-1))} disabled={si === 0}>←</OutBtn>
        <div style={{ flex: 1.5 }}><Btn full onClick={() => setSi(si+1)} color={S.gold}>{si < 4 ? "Continue →" : "Complete ✦"}</Btn></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PRAYER LIBRARY
// ═══════════════════════════════════════════════════════
function PrayerLibrary({ onBack }) {
  const [sel, setSel] = useState(null);
  const [exp, setExp] = useState(0);
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title="Prayer Library" onBack={onBack} />
      <div style={{ flex: 1, padding: 20, maxWidth: 540, margin: "0 auto", width: "100%", overflow: "auto" }}>
        {sel ? (
          <div style={{ animation: "fadeUp 0.3s ease-out" }}>
            <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: S.gold, fontFamily: S.body, fontSize: 13, cursor: "pointer", marginBottom: 16 }}>← All Prayers</button>
            <h3 style={{ fontFamily: S.heading, fontSize: 24, color: S.gold, marginBottom: 16 }}>{sel.title}</h3>
            <p style={{ fontFamily: S.body, fontSize: 15, color: "rgba(245,236,215,0.83)", lineHeight: 1.85, whiteSpace: "pre-line" }}>{sel.text}</p>
          </div>
        ) : PRAYER_CATS.map((cat, ci) => (
          <div key={ci} style={{ marginBottom: 13 }}>
            <button onClick={() => setExp(exp === ci ? -1 : ci)} style={{
              width: "100%", textAlign: "left", padding: "14px 16px", background: exp === ci ? "rgba(191,155,48,0.05)" : S.cardBg,
              border: `1px solid ${S.borderDim}`, borderRadius: exp === ci ? "10px 10px 0 0" : 10, cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontFamily: S.heading, fontSize: 17, fontWeight: 600, color: S.gold }}>{cat.name}</span>
              <span style={{ color: "rgba(191,155,48,0.35)", fontSize: 15, transform: exp === ci ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
            </button>
            {exp === ci && <div style={{ border: `1px solid ${S.borderDim}`, borderTop: "none", borderRadius: "0 0 10px 10px" }}>
              {cat.prayers.map((p, pi) => <button key={pi} onClick={() => setSel(p)} style={{ width: "100%", textAlign: "left", padding: "12px 16px", background: "transparent", border: "none", borderBottom: pi < cat.prayers.length - 1 ? "1px solid rgba(191,155,48,0.06)" : "none", cursor: "pointer", fontFamily: S.body, fontSize: 14, color: "rgba(245,236,215,0.68)" }}>{p.title}</button>)}
            </div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// JOURNAL (WITH N8N SYNC)
// ═══════════════════════════════════════════════════════
function JournalView({ onBack, journal, user, signIn }) {
  const [text, setText] = useState("");
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Header title="Prayer Journal" onBack={onBack} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
          <h3 style={{ fontFamily: S.heading, fontSize: 22, color: S.gold, marginBottom: 10 }}>Sign In to Use Your Journal</h3>
          <p style={{ fontFamily: S.body, fontSize: 13.5, color: S.textDim, maxWidth: 340, lineHeight: 1.6, marginBottom: 24 }}>Your prayer reflections sync across all your devices when you sign in with Google.</p>
          <button onClick={signIn} style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 10,
            padding: "12px 24px", cursor: "pointer", color: S.text, fontFamily: S.body, fontSize: 14,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  const { entries, loading, syncing, addEntry, clearEntries } = journal;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header title="Prayer Journal" subtitle={syncing ? "Syncing..." : `${entries.length} entr${entries.length !== 1 ? "ies" : "y"}`} onBack={onBack} />
      <div style={{ flex: 1, padding: 20, maxWidth: 540, margin: "0 auto", width: "100%", overflow: "auto" }}>
        <div style={{ marginBottom: 20 }}>
          <textarea placeholder="Write a reflection, prayer intention, or insight..." value={text} onChange={e => setText(e.target.value)}
            style={{ width: "100%", padding: "12px 14px", background: "rgba(255,248,235,0.04)", border: `1px solid ${S.borderDim}`, borderRadius: 10, color: S.text, fontFamily: S.body, fontSize: 13, lineHeight: 1.6, minHeight: 70, resize: "vertical", marginBottom: 8 }} />
          <Btn full onClick={() => { addEntry({ notes: { 0: text.trim() }, type: "reflection" }); setText(""); }} disabled={!text.trim()} color={S.gold}>Save Reflection</Btn>
        </div>
        {loading ? <p style={{ textAlign: "center", color: S.textDim, fontFamily: S.body }}>Loading...</p>
        : entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: 24, color: S.textDim }}>
            <p style={{ fontSize: 28, marginBottom: 8 }}>📖</p>
            <p style={{ fontFamily: S.heading, fontSize: 16 }}>Your journal is empty</p>
            <p style={{ fontFamily: S.body, fontSize: 11.5, marginTop: 5 }}>Examen reflections and notes appear here.</p>
          </div>
        ) : <>
          {[...entries].reverse().map((e, i) => (
            <div key={i} style={{ padding: "13px 15px", marginBottom: 9, background: S.cardBg, border: `1px solid ${S.borderDim}`, borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontFamily: S.body, fontSize: 10.5, color: "rgba(191,155,48,0.4)" }}>{new Date(e.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
                <span style={{ fontFamily: S.body, fontSize: 10.5, color: e.type === "examen" ? "rgba(191,155,48,0.5)" : "rgba(245,236,215,0.3)", textTransform: "capitalize", fontWeight: e.type === "examen" ? 600 : 400 }}>{e.type === "examen" ? "🕯️ Examen" : "✍️ Reflection"}</span>
              </div>
              {Object.entries(e.notes || {}).filter(([_, v]) => v).map(([key, val], ni) => (
                <div key={ni} style={{ marginTop: ni > 0 ? 8 : 0 }}>
                  {isNaN(key) && <p style={{ fontFamily: S.heading, fontSize: 12, color: "rgba(191,155,48,0.45)", marginBottom: 2, letterSpacing: "0.05em" }}>{key}</p>}
                  <p style={{ fontFamily: S.body, fontSize: 13, color: "rgba(245,236,215,0.68)", lineHeight: 1.55 }}>{val}</p>
                </div>
              ))}
            </div>
          ))}
          <button onClick={clearEntries} style={{ marginTop: 8, background: "none", border: "1px solid rgba(139,58,58,0.2)", borderRadius: 8, padding: "8px 14px", cursor: "pointer", color: "rgba(139,58,58,0.45)", fontFamily: S.body, fontSize: 11, width: "100%" }}>Clear Journal</button>
        </>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function Lumen() {
  const [view, setView] = useState(VIEWS.HOME);
  const [rosarySet, setRosarySet] = useState(null);
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const journal = useJournal(user);

  // Set dark theme for iPhone safe areas & prevent zoom
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#0d1117";
    document.head.appendChild(meta);
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
    document.body.style.background = "#0d1117";
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
    // Apple status bar
    const appleMeta = document.createElement("meta");
    appleMeta.name = "apple-mobile-web-app-status-bar-style";
    appleMeta.content = "black-translucent";
    document.head.appendChild(appleMeta);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: S.body, color: S.text, position: "relative", overflowX: "hidden", width: "100%", maxWidth: "100vw" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes crossGlow { 0%, 100% { filter: drop-shadow(0 0 8px rgba(191,155,48,0.3)); } 50% { filter: drop-shadow(0 0 20px rgba(191,155,48,0.6)); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        html, body, #root { background: #0d1117 !important; margin: 0; padding: 0; overflow-x: hidden; width: 100%; max-width: 100vw; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea:focus { outline: none; }
        textarea, input, button { font-size: 16px !important; } /* Prevent iOS zoom on focus */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(191,155,48,0.2); border-radius: 3px; }
      `}</style>
      <div style={{ position: "fixed", top: "-20%", right: "0", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(191,155,48,0.05) 0%, transparent 70%)", animation: "glow 8s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />

      {view === VIEWS.HOME && <HomeScreen setView={setView} user={user} signIn={signIn} signOut={signOut} />}
      {view === VIEWS.ROSARY && <RosarySelect onSelect={s => { setRosarySet(s); setView(VIEWS.ROSARY_PRAY); }} onBack={() => setView(VIEWS.HOME)} />}
      {view === VIEWS.ROSARY_PRAY && <RosaryPray mysterySet={rosarySet} onBack={() => setView(VIEWS.ROSARY)} />}
      {view === VIEWS.CONFESSION && <ConfessionPrep onBack={() => setView(VIEWS.HOME)} />}
      {view === VIEWS.EXAMEN && <DailyExamen onBack={() => setView(VIEWS.HOME)} addJournalEntry={user ? journal.addEntry : null} />}
      {view === VIEWS.PRAYERS && <PrayerLibrary onBack={() => setView(VIEWS.HOME)} />}
      {view === VIEWS.JOURNAL && <JournalView onBack={() => setView(VIEWS.HOME)} journal={journal} user={user} signIn={signIn} />}
    </div>
  );
}
