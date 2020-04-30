/**
 * Copyright (c) 2020 BlockDev AG
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const countries: { [key: string]: CountryType } = Object.freeze({
    af: {
        name: "Afghanistan",
    },
    al: {
        name: "Albania",
    },
    dz: {
        name: "Algeria",
    },
    as: {
        name: "American Samoa",
    },
    ad: {
        name: "Andorra",
    },
    ao: {
        name: "Angola",
    },
    ai: {
        name: "Anguilla",
    },
    aq: {
        name: "Antarctica",
    },
    ag: {
        name: "Antigua and Barbuda",
    },
    ar: {
        name: "Argentina",
    },
    am: {
        name: "Armenia",
    },
    aw: {
        name: "Aruba",
    },
    au: {
        name: "Australia",
    },
    at: {
        name: "Austria",
    },
    az: {
        name: "Azerbaijan",
    },
    bs: {
        name: "Bahamas",
    },
    bh: {
        name: "Bahrain",
    },
    bd: {
        name: "Bangladesh",
    },
    bb: {
        name: "Barbados",
    },
    by: {
        name: "Belarus",
    },
    be: {
        name: "Belgium",
    },
    bz: {
        name: "Belize",
    },
    bj: {
        name: "Benin",
    },
    bm: {
        name: "Bermuda",
    },
    bt: {
        name: "Bhutan",
    },
    bo: {
        name: "Bolivia",
    },
    ba: {
        name: "Bosnia and Herzegovina",
    },
    bw: {
        name: "Botswana",
    },
    br: {
        name: "Brazil",
    },
    vg: {
        name: "British Virgin Islands",
    },
    bn: {
        name: "Brunei",
    },
    bg: {
        name: "Bulgaria",
    },
    bf: {
        name: "Burkina Faso",
    },
    bi: {
        name: "Burundi",
    },
    kh: {
        name: "Cambodia",
    },
    cm: {
        name: "Cameroon",
    },
    ca: {
        name: "Canada",
    },
    cv: {
        name: "Cape Verde",
    },
    ky: {
        name: "Cayman Islands",
    },
    cf: {
        name: "Central African Republic",
    },
    td: {
        name: "Chad",
    },
    cl: {
        name: "Chile",
    },
    cn: {
        name: "China",
    },
    cx: {
        name: "Christmas Island",
    },
    cc: {
        name: "Cocos (Keeling) Islands",
    },
    co: {
        name: "Colombia",
    },
    km: {
        name: "Comoros",
    },
    ck: {
        name: "Cook Islands",
    },
    cr: {
        name: "Costa Rica",
    },
    hr: {
        name: "Croatia",
    },
    cu: {
        name: "Cuba",
    },
    cw: {
        name: "Curaçao",
    },
    cy: {
        name: "Cyprus",
    },
    cz: {
        name: "Czech Republic",
    },
    cd: {
        name: "DR Congo",
    },
    dk: {
        name: "Denmark",
    },
    dj: {
        name: "Djibouti",
    },
    dm: {
        name: "Dominica",
    },
    do: {
        name: "Dominican Republic",
    },
    ec: {
        name: "Ecuador",
    },
    eg: {
        name: "Egypt",
    },
    sv: {
        name: "El Salvador",
    },
    gq: {
        name: "Equatorial Guinea",
    },
    er: {
        name: "Eritrea",
    },
    ee: {
        name: "Estonia",
    },
    et: {
        name: "Ethiopia",
    },
    fk: {
        name: "Falkland Islands",
    },
    fo: {
        name: "Faroe Islands",
    },
    fj: {
        name: "Fiji",
    },
    fi: {
        name: "Finland",
    },
    fr: {
        name: "France",
    },
    pf: {
        name: "French Polynesia",
    },
    tf: {
        name: "French Southern and Antarctic Lands",
    },
    ga: {
        name: "Gabon",
    },
    gm: {
        name: "Gambia",
    },
    ge: {
        name: "Georgia",
    },
    de: {
        name: "Germany",
    },
    gh: {
        name: "Ghana",
    },
    gi: {
        name: "Gibraltar",
    },
    gr: {
        name: "Greece",
    },
    gl: {
        name: "Greenland",
    },
    gd: {
        name: "Grenada",
    },
    gu: {
        name: "Guam",
    },
    gt: {
        name: "Guatemala",
    },
    gg: {
        name: "Guernsey",
    },
    gn: {
        name: "Guinea",
    },
    gw: {
        name: "Guinea-Bissau",
    },
    gy: {
        name: "Guyana",
    },
    ht: {
        name: "Haiti",
    },
    hn: {
        name: "Honduras",
    },
    hk: {
        name: "Hong Kong",
    },
    hu: {
        name: "Hungary",
    },
    is: {
        name: "Iceland",
    },
    in: {
        name: "India",
    },
    id: {
        name: "Indonesia",
    },
    ir: {
        name: "Iran",
    },
    iq: {
        name: "Iraq",
    },
    ie: {
        name: "Ireland",
    },
    im: {
        name: "Isle of Man",
    },
    il: {
        name: "Israel",
    },
    it: {
        name: "Italy",
    },
    jm: {
        name: "Jamaica",
    },
    jp: {
        name: "Japan",
    },
    je: {
        name: "Jersey",
    },
    jo: {
        name: "Jordan",
    },
    kz: {
        name: "Kazakhstan",
    },
    ke: {
        name: "Kenya",
    },
    ki: {
        name: "Kiribati",
    },
    xk: {
        name: "Kosovo",
    },
    kw: {
        name: "Kuwait",
    },
    kg: {
        name: "Kyrgyzstan",
    },
    la: {
        name: "Laos",
    },
    lv: {
        name: "Latvia",
    },
    lb: {
        name: "Lebanon",
    },
    ls: {
        name: "Lesotho",
    },
    lr: {
        name: "Liberia",
    },
    ly: {
        name: "Libya",
    },
    li: {
        name: "Liechtenstein",
    },
    lt: {
        name: "Lithuania",
    },
    lu: {
        name: "Luxembourg",
    },
    mo: {
        name: "Macau",
    },
    mk: {
        name: "Macedonia",
    },
    mg: {
        name: "Madagascar",
    },
    mw: {
        name: "Malawi",
    },
    my: {
        name: "Malaysia",
    },
    mv: {
        name: "Maldives",
    },
    ml: {
        name: "Mali",
    },
    mt: {
        name: "Malta",
    },
    mh: {
        name: "Marshall Islands",
    },
    mq: {
        name: "Martinique",
    },
    mr: {
        name: "Mauritania",
    },
    mu: {
        name: "Mauritius",
    },
    yt: {
        name: "Mayotte",
    },
    mx: {
        name: "Mexico",
    },
    fm: {
        name: "Micronesia",
    },
    md: {
        name: "Moldova",
    },
    mc: {
        name: "Monaco",
    },
    mn: {
        name: "Mongolia",
    },
    me: {
        name: "Montenegro",
    },
    ms: {
        name: "Montserrat",
    },
    ma: {
        name: "Morocco",
    },
    mz: {
        name: "Mozambique",
    },
    mm: {
        name: "Myanmar",
    },
    na: {
        name: "Namibia",
    },
    nr: {
        name: "Nauru",
    },
    np: {
        name: "Nepal",
    },
    nl: {
        name: "Netherlands",
    },
    nc: {
        name: "New Caledonia",
    },
    nz: {
        name: "New Zealand",
    },
    ni: {
        name: "Nicaragua",
    },
    ne: {
        name: "Niger",
    },
    ng: {
        name: "Nigeria",
    },
    nu: {
        name: "Niue",
    },
    nf: {
        name: "Norfolk Island",
    },
    kp: {
        name: "North Korea",
    },
    mp: {
        name: "Northern Mariana Islands",
    },
    no: {
        name: "Norway",
    },
    om: {
        name: "Oman",
    },
    pk: {
        name: "Pakistan",
    },
    pw: {
        name: "Palau",
    },
    ps: {
        name: "Palestine",
    },
    pa: {
        name: "Panama",
    },
    pg: {
        name: "Papua New Guinea",
    },
    py: {
        name: "Paraguay",
    },
    pe: {
        name: "Peru",
    },
    ph: {
        name: "Philippines",
    },
    pn: {
        name: "Pitcairn Islands",
    },
    pl: {
        name: "Poland",
    },
    pt: {
        name: "Portugal",
    },
    pr: {
        name: "Puerto Rico",
    },
    qa: {
        name: "Qatar",
    },
    cg: {
        name: "Republic of the Congo",
    },
    ro: {
        name: "Romania",
    },
    ru: {
        name: "Russia",
    },
    rw: {
        name: "Rwanda",
    },
    re: {
        name: "Réunion",
    },
    bl: {
        name: "Saint Barthélemy",
    },
    kn: {
        name: "Saint Kitts and Nevis",
    },
    lc: {
        name: "Saint Lucia",
    },
    mf: {
        name: "Saint Martin",
    },
    vc: {
        name: "Saint Vincent and the Grenadines",
    },
    ws: {
        name: "Samoa",
    },
    sm: {
        name: "San Marino",
    },
    sa: {
        name: "Saudi Arabia",
    },
    sn: {
        name: "Senegal",
    },
    rs: {
        name: "Serbia",
    },
    sc: {
        name: "Seychelles",
    },
    sl: {
        name: "Sierra Leone",
    },
    sg: {
        name: "Singapore",
    },
    sx: {
        name: "Sint Maarten",
    },
    sk: {
        name: "Slovakia",
    },
    si: {
        name: "Slovenia",
    },
    sb: {
        name: "Solomon Islands",
    },
    so: {
        name: "Somalia",
    },
    za: {
        name: "South Africa",
    },
    gs: {
        name: "South Georgia",
    },
    kr: {
        name: "South Korea",
    },
    ss: {
        name: "South Sudan",
    },
    es: {
        name: "Spain",
    },
    lk: {
        name: "Sri Lanka",
    },
    sd: {
        name: "Sudan",
    },
    sr: {
        name: "Suriname",
    },
    sz: {
        name: "Swaziland",
    },
    se: {
        name: "Sweden",
    },
    ch: {
        name: "Switzerland",
    },
    sy: {
        name: "Syria",
    },
    tw: {
        name: "Taiwan",
    },
    tj: {
        name: "Tajikistan",
    },
    tz: {
        name: "Tanzania",
    },
    th: {
        name: "Thailand",
    },
    tg: {
        name: "Togo",
    },
    tk: {
        name: "Tokelau",
    },
    to: {
        name: "Tonga",
    },
    tt: {
        name: "Trinidad and Tobago",
    },
    tn: {
        name: "Tunisia",
    },
    tr: {
        name: "Turkey",
    },
    tm: {
        name: "Turkmenistan",
    },
    tc: {
        name: "Turks and Caicos Islands",
    },
    tv: {
        name: "Tuvalu",
    },
    ug: {
        name: "Uganda",
    },
    ua: {
        name: "Ukraine",
    },
    ae: {
        name: "United Arab Emirates",
    },
    gb: {
        name: "United Kingdom",
    },
    us: {
        name: "United States",
    },
    vi: {
        name: "United States Virgin Islands",
    },
    uy: {
        name: "Uruguay",
    },
    uz: {
        name: "Uzbekistan",
    },
    vu: {
        name: "Vanuatu",
    },
    va: {
        name: "Vatican City",
    },
    ve: {
        name: "Venezuela",
    },
    vn: {
        name: "Vietnam",
    },
    wf: {
        name: "Wallis and Futuna",
    },
    eh: {
        name: "Western Sahara",
    },
    ye: {
        name: "Yemen",
    },
    zm: {
        name: "Zambia",
    },
    zw: {
        name: "Zimbabwe",
    },
    ax: {
        name: "Åland Islands",
    },
})

export const unknownCountry: CountryType = Object.freeze({
    name: "Unknown",
})

export type CountryType = {
    name: string
}

export const resolveCountry = (countryCode?: string): CountryType => {
    if (!countryCode) {
        return unknownCountry
    }
    return (
        countries[countryCode.toLowerCase()] || {
            ...unknownCountry,
            countryCode,
        }
    )
}
