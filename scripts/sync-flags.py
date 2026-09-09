# -*- coding: utf-8 -*-
import io, os, json

# ISO 3166-1 alpha-2 -> (name, dial code)
DATA = """AF|Afghanistan|93
AL|Albania|355
DZ|Algeria|213
AS|American Samoa|1684
AD|Andorra|376
AO|Angola|244
AI|Anguilla|1264
AG|Antigua and Barbuda|1268
AR|Argentina|54
AM|Armenia|374
AW|Aruba|297
AU|Australia|61
AT|Austria|43
AZ|Azerbaijan|994
BS|Bahamas|1242
BH|Bahrain|973
BD|Bangladesh|880
BB|Barbados|1246
BY|Belarus|375
BE|Belgium|32
BZ|Belize|501
BJ|Benin|229
BM|Bermuda|1441
BT|Bhutan|975
BO|Bolivia|591
BA|Bosnia and Herzegovina|387
BW|Botswana|267
BR|Brazil|55
BN|Brunei|673
BG|Bulgaria|359
BF|Burkina Faso|226
BI|Burundi|257
KH|Cambodia|855
CM|Cameroon|237
CA|Canada|1
CV|Cape Verde|238
KY|Cayman Islands|1345
CF|Central African Republic|236
TD|Chad|235
CL|Chile|56
CN|China|86
CO|Colombia|57
KM|Comoros|269
CG|Congo|242
CD|Congo (DRC)|243
CK|Cook Islands|682
CR|Costa Rica|506
CI|Cote d'Ivoire|225
HR|Croatia|385
CU|Cuba|53
CW|Curacao|599
CY|Cyprus|357
CZ|Czechia|420
DK|Denmark|45
DJ|Djibouti|253
DM|Dominica|1767
DO|Dominican Republic|1809
EC|Ecuador|593
EG|Egypt|20
SV|El Salvador|503
GQ|Equatorial Guinea|240
ER|Eritrea|291
EE|Estonia|372
SZ|Eswatini|268
ET|Ethiopia|251
FJ|Fiji|679
FI|Finland|358
FR|France|33
GF|French Guiana|594
PF|French Polynesia|689
GA|Gabon|241
GM|Gambia|220
GE|Georgia|995
DE|Germany|49
GH|Ghana|233
GI|Gibraltar|350
GR|Greece|30
GL|Greenland|299
GD|Grenada|1473
GP|Guadeloupe|590
GU|Guam|1671
GT|Guatemala|502
GN|Guinea|224
GW|Guinea-Bissau|245
GY|Guyana|592
HT|Haiti|509
HN|Honduras|504
HK|Hong Kong|852
HU|Hungary|36
IS|Iceland|354
IN|India|91
ID|Indonesia|62
IR|Iran|98
IQ|Iraq|964
IE|Ireland|353
IM|Isle of Man|44
IL|Israel|972
IT|Italy|39
JM|Jamaica|1876
JP|Japan|81
JE|Jersey|44
JO|Jordan|962
KZ|Kazakhstan|7
KE|Kenya|254
KI|Kiribati|686
KW|Kuwait|965
KG|Kyrgyzstan|996
LA|Laos|856
LV|Latvia|371
LB|Lebanon|961
LS|Lesotho|266
LR|Liberia|231
LY|Libya|218
LI|Liechtenstein|423
LT|Lithuania|370
LU|Luxembourg|352
MO|Macao|853
MG|Madagascar|261
MW|Malawi|265
MY|Malaysia|60
MV|Maldives|960
ML|Mali|223
MT|Malta|356
MH|Marshall Islands|692
MQ|Martinique|596
MR|Mauritania|222
MU|Mauritius|230
MX|Mexico|52
FM|Micronesia|691
MD|Moldova|373
MC|Monaco|377
MN|Mongolia|976
ME|Montenegro|382
MS|Montserrat|1664
MA|Morocco|212
MZ|Mozambique|258
MM|Myanmar|95
NA|Namibia|264
NR|Nauru|674
NP|Nepal|977
NL|Netherlands|31
NC|New Caledonia|687
NZ|New Zealand|64
NI|Nicaragua|505
NE|Niger|227
NG|Nigeria|234
NU|Niue|683
KP|North Korea|850
MK|North Macedonia|389
NO|Norway|47
OM|Oman|968
PK|Pakistan|92
PW|Palau|680
PS|Palestine|970
PA|Panama|507
PG|Papua New Guinea|675
PY|Paraguay|595
PE|Peru|51
PH|Philippines|63
PL|Poland|48
PT|Portugal|351
PR|Puerto Rico|1787
QA|Qatar|974
RE|Reunion|262
RO|Romania|40
RU|Russia|7
RW|Rwanda|250
KN|Saint Kitts and Nevis|1869
LC|Saint Lucia|1758
VC|Saint Vincent and the Grenadines|1784
WS|Samoa|685
SM|San Marino|378
ST|Sao Tome and Principe|239
SA|Saudi Arabia|966
SN|Senegal|221
RS|Serbia|381
SC|Seychelles|248
SL|Sierra Leone|232
SG|Singapore|65
SK|Slovakia|421
SI|Slovenia|386
SB|Solomon Islands|677
SO|Somalia|252
ZA|South Africa|27
KR|South Korea|82
SS|South Sudan|211
ES|Spain|34
LK|Sri Lanka|94
SD|Sudan|249
SR|Suriname|597
SE|Sweden|46
CH|Switzerland|41
SY|Syria|963
TW|Taiwan|886
TJ|Tajikistan|992
TZ|Tanzania|255
TH|Thailand|66
TL|Timor-Leste|670
TG|Togo|228
TO|Tonga|676
TT|Trinidad and Tobago|1868
TN|Tunisia|216
TR|Turkey|90
TM|Turkmenistan|993
TC|Turks and Caicos Islands|1649
TV|Tuvalu|688
UG|Uganda|256
UA|Ukraine|380
AE|United Arab Emirates|971
GB|United Kingdom|44
US|United States|1
UY|Uruguay|598
UZ|Uzbekistan|998
VU|Vanuatu|678
VA|Vatican City|39
VE|Venezuela|58
VN|Vietnam|84
VG|Virgin Islands (British)|1284
VI|Virgin Islands (U.S.)|1340
YE|Yemen|967
ZM|Zambia|260
ZW|Zimbabwe|263"""

# Example mobile numbers, one per country, in national format (the trunk
# prefix is dropped -- it is not dialled together with a country code).
#
# Each starts from a real mobile prefix for that country, so the number looks
# native to a local reader, but the subscriber digits are a fixed 123 4567-style
# run that no operator issues as a real line. They are placeholders: the field
# shows one, it is never submitted.
EXAMPLES = {
    'AE': '50 123 4567',
    'SA': '50 123 4567',
    'QA': '3312 3456',
    'KW': '5012 3456',
    'BH': '3612 3456',
    'OM': '9212 3456',
    'EG': '100 123 4567',
    'JO': '7 9012 3456',
    'LB': '71 123 456',
    'IQ': '770 123 4567',
    'SY': '944 123 456',
    'YE': '712 123 456',
    'PS': '599 123 456',
    'MA': '650 123456',
    'DZ': '551 23 45 67',
    'TN': '20 123 456',
    'LY': '91 2345678',
    'SD': '91 123 4567',
    'GB': '7400 123456',
    'US': '201 555 0123',
    'CA': '204 555 0123',
    'IN': '81234 56789',
    'PK': '301 2345678',
    'BD': '1812 345678',
    'LK': '71 234 5678',
    'PH': '905 123 4567',
    'ID': '812 34567890',
    'MY': '12 345 6789',
    'SG': '8123 4567',
    'TH': '81 234 5678',
    'CN': '131 2345 6789',
    'JP': '90 1234 5678',
    'KR': '10 1234 5678',
    'AU': '412 345 678',
    'NZ': '21 123 4567',
    'FR': '6 12 34 56 78',
    'DE': '151 2345678',
    'IT': '312 345 6789',
    'ES': '612 345 678',
    'PT': '912 345 678',
    'NL': '6 12345678',
    'BE': '470 12 34 56',
    'CH': '78 123 4567',
    'AT': '664 123456',
    'SE': '70 123 4567',
    'NO': '406 12 345',
    'DK': '32 12 34 56',
    'FI': '41 234 5678',
    'IE': '85 123 4567',
    'PL': '512 345 678',
    'GR': '691 234 5678',
    'TR': '501 234 5678',
    'RU': '912 345 67 89',
    'UA': '50 123 4567',
    'ZA': '71 123 4567',
    'NG': '802 123 4567',
    'KE': '712 123456',
    'ET': '91 123 4567',
    'GH': '23 123 4567',
    'TZ': '621 234 567',
    'UG': '712 345678',
    'BR': '11 91234 5678',
    'MX': '222 123 4567',
    'AR': '11 2345 6789',
    'CL': '9 6123 4567',
    'CO': '301 234 5678',
    'PE': '912 345 678',
}

# A country with no entry above still needs a plausible example. Most national
# numbers land near 10 digits total, so size the local part by how many digits
# the country code already takes, and fill it from a repeating run that reads
# as a placeholder rather than a callable line.
DIGITS = '1234567890'


def fallback(dial):
    n = max(6, 10 - len(dial))
    groups = []
    while n > 4:
        groups.append(3)
        n -= 3
    groups.append(n)

    out, i = [], 0
    for size in groups:
        out.append(''.join(DIGITS[(i + k) % 10] for k in range(size)))
        i += size
    return ' '.join(out)


flags_dir = 'node_modules/flag-icons/flags/4x3'
have = {f[:-4].upper() for f in os.listdir(flags_dir) if f.endswith('.svg')}

rows, missing = [], []
for line in DATA.strip().split('\n'):
    code, name, dial = line.split('|')
    if code not in have:
        missing.append(code)
        continue
    rows.append((code, name, dial))

rows.sort(key=lambda r: r[1])

out = []
out.append("/**")
out.append(" * countries.js -- ISO 3166-1 alpha-2 code, display name, and E.164 dial code.")
out.append(" *")
out.append(" * `code` also names the flag file (`/flags/ae.svg`), so every entry here was")
out.append(" * checked against the SVGs flag-icons actually ships -- no row can render a")
out.append(" * blank flag. `example` is a sample mobile number in that country's national")
out.append(" * format, shown as the phone field's placeholder.")
out.append(" *")
out.append(" * Sorted by name; the picker floats a few common origins to the top itself.")
out.append(" *")
out.append(" * Generated by scripts/sync-flags.py -- run `npm run flags:sync` to rebuild")
out.append(" * this file and public/flags. Edit the script, not this output.")
out.append(" */")
out.append("")
out.append("export const COUNTRIES = [")
for code, name, dial in rows:
    nm = name.replace("'", "\\'")
    ex = EXAMPLES.get(code) or fallback('+' + dial)
    out.append(
        "  { code: '%s', name: '%s', dial: '+%s', example: '%s' },"
        % (code, nm, dial, ex)
    )
out.append("]")
out.append("")
out.append("/** Shown first in the picker -- where most of our patients contact us from. */")
out.append("export const PRIORITY_CODES = ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'EG']")
out.append("")
out.append("export const DEFAULT_COUNTRY = 'AE'")
out.append("")
out.append("export const byCode = code =>")
out.append("  COUNTRIES.find(c => c.code === String(code || '').toUpperCase())")
out.append("")

io.open('src/data/countries.js', 'w', encoding='utf-8').write('\n'.join(out))
print('countries written:', len(rows))
print('skipped (no flag shipped):', missing)

# Copy just the flags we reference into public/, so the browser fetches one
# small file per selection instead of the browser parsing a 496K stylesheet of
# inlined data URIs.
import shutil
out_dir = 'public/flags'
if os.path.isdir(out_dir):
    shutil.rmtree(out_dir)
os.makedirs(out_dir)
for code, _n, _d in rows:
    shutil.copyfile(
        os.path.join(flags_dir, code.lower() + '.svg'),
        os.path.join(out_dir, code.lower() + '.svg'),
    )
print('flags copied to public/flags:', len(rows))
