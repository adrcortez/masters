'use strict';


angular
    .module('colorpicker.templates', [])


    .run(['$templateCache', function ($templateCache) {
        $templateCache.put("templates/colorpicker/image.html",
            '<img alt="colormap" usemap="#{{ name }} "src=" \n' +
            'data:image/gif;base64,R0lGODlh/gDbAMYyAJkAAADM/zMzAAAzAP9QUA \n' +
            'AzZoAAAGYzAGYAM/9mZmYAzGZmMzMzmQBmZv9mAJkAmTNmmZn/Zv/M/2YAZv \n' +
            '/MzADMmZkz/5kA//8zmcwzmcwAmf8zAMwzAMwAAJkzM5kAM5n/MwBmmZlmAD \n' +
            'MzzAAzzAAA/wAAzDNm/wBm/wBmzP+Zmcxm/5lm/2aZmf+Z/wCZ//+ZAMyZAP \n' +
            '///8xmmf//ZgDMZv8zzGb/zP/MZjOZM//MmQCZmZkzZjPM/8z//2b/mZmZ/w \n' +
            'BmAP//zGYA/2b/ZswAZplmMwAAmQD/mZkAzACZAMz/zGZmmczM//+ZZv//AD \n' +
            'PMzDOZZjNmzGZm/5nM//9m/zPMMwDMAGb//2bM////mcz/mZn/mf/MAMz/M2 \n' +
            'b/MwD//wAzmQAAZpnMAJkzmf8AAJkzAP8AZgCZM8wA/2aZ/5n/zAD/AP8A/8 \n' +
            'wAzP+ZM8z/ZjOZ/8xmAACZzDMz/2aZAP9mzP+ZzMzMAP9mmTNmAMyZ/wD/zJ \n' +
            'mZZswz/////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAH8ALAAAAAD+AN \n' +
            'sAAAf+gH+Cg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6 \n' +
            'ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHuAXKjxDNj1LQj2HTj0 \n' +
            'fWjybZj2LcyMXK4MuKzeTOitDo0YrT7NSK1vDXitn02orc+N3ev+H94oXlAp \n' +
            'orlK6gukLtErorFK+hvEL1ItorlK+ivn25/Gn8J7DjQIMgDyocudChyYcSU0 \n' +
            '60yPIixlkbYxbwSBNCyJtSSOoMc7LnEZVATbQcKuYlLZkba3rEGXInSZ8ng6 \n' +
            'ok2tIoTKT+lHZkCtLpSKgmpaakytKqLKxZtQbkatCrQrD+DsVKJGvRbCy0/d \n' +
            'SuZZvObUK4DeVGpFvRLiy84fSW49vXLzvA8QTXI5zP8CvE4BSTY4zO8WPI1i \n' +
            'TTo4zPsivMyjQ34wzN8zTQoUULJV3UNCvUM1Wzzuka9k/ZtGvbVoVbtU3Wrn \n' +
            'nClj2b9PBVxXUj770cOO3nqRpoRxyiu+I54BmnGO+YhHnIJdJLpsOeMoP32E \n' +
            'lpn79dZvf73muC3x8e5/j/5O1k3oDn+ZTegeoFxd6C7RH13oPwxecJfRTW1w \n' +
            '9+GOYXEH8c9lcQgCAGmBCBJBbYEIIoJhgRgyw2WBGEMEYoISYV1mhhhjhq2O \n' +
            'GOHoboo4glBmliikSq2OKRLsb+qKSMM0pi45MN5ChlCDxWOcePWKYg5JYkFO \n' +
            'llCUiGSceSZDLQ5CRQ2jhljlbymOWPXAr5ZZFiIlnmkmc6mWaFa+LY5o5v+h \n' +
            'hnkHMSWeeRdyqZZyR78tknhn92GGiIg5ZYaIqHtphojItC0iiFj0IaKX+Tgl \n' +
            'gpiZeimCmLm8LY6SOf0hcqfqOSWup/pxKYKoKrMtgqhK86Eut8s95X63634p \n' +
            'qrebse2OuCvz4YbCPDaldsd8eCl+x4yzLbLJjPjhmtmdMuUm2U12Z75bbddv \n' +
            'ltuOJGW6651V5LZbbbatntt+A+Oy658yJyrr3q5tsuv/D+GzAiLTQc6w4Qzw \n' +
            'rFxLX+BmDxrS9knCsKHO96wse9jiDyr0yUvPAgDafsMJQQtxzxlBPHTLGVFt \n' +
            'd8cZYZ56wxlxz33PGXHwcNspgiFz1ymSUnbfK8Kje9MoUuR/0yhjJXPTOHNm \n' +
            'd9M4g6d70ziT6H/TOKQpc9NItGp300jEq3vXSnTsf9tNR0T2313VdrrffWXv \n' +
            'f9tdiAj2324Gerbfjabif+9oxyN95C3ZDvgPfkUOxteQB+Z/5C4JyjQPjnJx \n' +
            'wu+giKl87EmY7LHXndlON9+d6a+9154KATPvrhpiuOeupOr05363e/rnfsfc \n' +
            '8OeO2D32547onvzrvKvksNvNXCa02818aLjbzZyqvNvNv+zj/fcPRRT1919V \n' +
            'lf33X2YW9fdvdpf992+OKT77L5MqNvs/o6s++z+0KDn9HkpzT6Pc9+LcNfzP \n' +
            'RXM/7lzH89A2DQBFg0AibNgLxDIMQUODEGWsyBGYMgxyT4MQqKzIKLi4/4oK \n' +
            'dBDlbOgyDcnAhJGDoTovB0TVphyjQoOQ56EHMgFKHnSGhC0qEQg6njoQt/GE \n' +
            'Mh0rCIN2xSFKa4wgpY0X58yCL+wMBF/fXgi/yLgxj9p4YyAnAKaBTgENZIQA \n' +
            'W4ETtTjCMVHWfFOl4xclnMoxYpx8U+dvFyXwwkGDUnxkKOsXNlTKQZQYfGRq \n' +
            'ZxdGuMJBtN58ZKvtEycszkHJv+ZsdO3jFqegzlHqvmx1L+MWuCTOUgu2bIVh \n' +
            '4ybIqM5SLL5shaPjJtkszlJNtmyV5e0iiaDOYmPUnMT4rymKM0pTJPqcpmrt \n' +
            'KV0HylLKc5S1ta85a6zOYufcnNXyJDmOCMQjHHWQFkmpMPy0wnGJzJzh5E85 \n' +
            '1xoKY81XDNek5Bm/gcQjf3qYB9hFOY5CzmOZGpzmW205nwjOY8qWnPa+ZTm/ \n' +
            'zspj//qcmAEnOgxyyoMg/azIRCc6HTbKg1H5rNiHJzohSVo0U9iVFRatSUHF \n' +
            'WlR10JUlmK1JYk1aVJfYnSlE5xpZ1saShfWsqYpnKmraxpLG9ay5zmcqe97K \n' +
            'lPgWr+R6Hqkah+NKogkWpIpSqSqY50qiShakmpppSqdbRqHrHaR60GkquF9G \n' +
            'oiwdpIsUaSrJU0K0XRakW1ZpGtXHTrF+EqRrmWka5otOsa8epNY/hUpXz1Kz \n' +
            'oBK1h3Etaw9ESsYvXJWL3+k6/l9Ctg1ylYwsbTsIi9p2IZ209vPDaOoJXsaC \n' +
            'trWsymdrOs9UYOdvvYGviWqkgIrlVvQFysYuG4Ws2CcrlKheZ6FQjQBSsLpi \n' +
            'tWC1iXrBfIbjF2y13ehtO34P0tOYNLXuGek7joLa46j8te5LZTufBdLjybS1 \n' +
            '/nzhO6+I2uPafLX+rm07oAvi4/s0tg7QKjuwj2bibDy2D+8XayvBA2byjTS2 \n' +
            'H1lrK9GHZvKuPLYfm2sr4gtm8s80ti/dayvyj2by4DzGIB97LAMDbwLhJMYw \n' +
            'U3+MYOjrCOJVzhHls4w0DWcIeH7OEQG1nEJU6yiVPMZBW3+MkujrGUZWyLGl \n' +
            's5BzjOcg12zGUk+PjLNwiymLFA5DJn4chopoKS1wyEJruZBVCOswWmTOcL4O \n' +
            'LKNdYyjru8YzD7eMxBNjOR03xkNiv5zU2WM5TrPOU74znBer4xn3Xs5x4DGs \n' +
            'iCHjKhjWzoJCOayYp+MqOl7OhHdzfSDZ50hCtd4UtnONMd3nSIO13iT6c41C \n' +
            '0edYxLberdoprBqoYwqynsagz+w5rDsgYxrUlsaxTjmsW6hjGve/3r8Aa7vM \n' +
            'NOb7Hbe+z4Jru+y85vs/v77ABHu8DTNnW1wXtt8mYbvdtmb7fh+236hhu/4+ \n' +
            'ZvuQF8bgKn+9Hr9m27g/tu4sb7uPNWbr2be2/o5nu6+7Zuv6lMi16fOuAD93 \n' +
            'LBD07mhC9czQ1/OJwjPnE738Li3A34lgde8DAfPOFnXnjD2/zwiM954v/Gs8 \n' +
            'oz3nKOw/zjMxe5zUt+iyAY3eJXSHq12cD0a//g6dleg9S37YOqd7sJWP/2Hr \n' +
            'Ye7hV4fdx+CHu500D2cyfh7LMwutqPfuWku13pWma63Jve5afbHepglrrepz \n' +
            '7mqvv+3epmxrrgs57mrRue62z2uuK//uawO17scia75Mte57NbHu2uWLvm2Y \n' +
            '7gt3se7gyeu+jpDuG7mx7vFN676vmO4b+7HvAcHrzsCQ/iw9se8SRevO4Zj+ \n' +
            'LH+x7yLJ688CkP48sbH/Op2LzyOf/55oN+9NAn/emnj/rVW5/1r88+7GfPfd \n' +
            'rf/vu43734ef/78gN/+Ogn/vHXj3xSLP/9QXC+/K8Q/fqzgfr4/8H1978G7f \n' +
            'vfB90XgE0AfgS4B+N3gCtgfgroB+nXgGnAfhCYBKYAf8s3f85nf9GXf9THf9 \n' +
            'f3f9ongN1XgOCHgOO3gObngOkXgew3gRS4eRbYfBgIfRr+OH0caH0emH0gyH \n' +
            '0i+H0kKH4mWH4oiH4quH4s2IJr94KfF4OjN4OnV4Ord4Ovl4Ozt4O314O794 \n' +
            'O/F4TDN4THV4RGaHRI6HlKKHpMaHpOqHpQ6HpSKHtUaHtWqHtY6HtaKHxcaH \n' +
            'xe+IVh+HZjOHdleHdnuHdp+HdrOHhteHhvuHhx+HhzOHl1eHl3aIR56HZ7KH \n' +
            'd9aHd/qHeB6HeDKHiFaHiHqHiJ6HiLKHmNaHmP2IKRmHSTyHSV+HSXKHWZWH \n' +
            'WbiHWduHWf6HWhGHajSHal2H6i8IVHmIqreH+t+Ir9F4uzOIC1eIsJmIu7+I \n' +
            'C9eIoUmIr0t4qtqH+vGIsAOIv+tWiAt5iLDLiLvSiBpQCMakeNw3iNxqiNyd \n' +
            'iNzAiOzziOpTAA9AiMaHCPeWgF+riHRNCPfcgFAPmHSzCQgSgDBjmIEpCQhe \n' +
            'gCDHmIVfCQidgGErmIblCRjTgBGBkK9LiR9Qh/9/iR+Dh/+jiS+2h//XiS/p \n' +
            'h/ALmSAcl/A/mSBPl/BjmTBymACXmTClmADLmTDYmAD/mTELmAEjmUE+mAFX \n' +
            'mUFhmBGLmUGckJHPmUHal5IDmVIel5JHmVJSl6KLmVKWl6LPmVLal6MDmWMe \n' +
            'l6NHmWNSl7OLmWOWl7PPmWPal7QDmXQel7RHmXRSl8SLmXSWl8TPmXTXkJUD \n' +
            'mYUUn+lYZZlViZmFnJlYzZlWD5mGFJlpJZlmhZmWnJlpjZlnC5mXFJl55Zl3 \n' +
            'gZmnnJl6TZl4B5moEpCYS5mgNwmK6JBooZm1bQmLRJBJB5m1wwmbq5BJbZmz \n' +
            'KQmcApAZw5nC7wmcZZBaKZnG1QmszpBqj5nBNACaxJmK95mLKpmLXZmLgJmb \n' +
            's5mb5pmcGZmcTJmcf5mcopms1ZmtCJmtI5nVBZnYZ5nYmZnYy5nY/ZnZL5nZ \n' +
            'UZnpg5nptZnp55nqGZnqS5nqfZnu7JkfBJlfKJlfTJlfYJlvhJlvqJlvzJlv \n' +
            '4JlwBKlwKKlwTKlwYKmAiaoPS4oFPZoFf5oFsZoV85oWP+WaFneaFrmaFvua \n' +
            'Fz2aF3+aF7GaJ/OaIkaqIgiaIkqaIoyaIs6aIwCaM0KaM4SaM8aaNAiaNEqa \n' +
            'NIyaNM6aMJCqQfKaQjSaQnaaQriaQvqaQzyaQ36aQ7CaU/KaVDSaVHaaVLia \n' +
            'XuqaX3yKX66KX9CKYAKaYDSaYGaaYJiaYMqaYPyaYS6aYVCaepCQkkqqB0aq \n' +
            'eziad6mpt86qe/CaiCWpyEaqjLiaiKGp2T0KgbSaewaad4apt6yqe86aeAKp \n' +
            'yCSqjIaaiI6pyKKqfTSaqQeqqTqqqW2qqZCqucOqufagmNqgfGCqRKkKxC+g \n' +
            'XMSqQR8KxGugXSiqRCUK1KSgH+2Mqkd7CtTmoH3gqlNhCuUqoB5EqlZHCuVp \n' +
            'oJ02ms7Hqsr5ms8Kqsssms9Nqstfms+AqtuCmt/Dqtu1mtAGutvomtBJutwb \n' +
            'mtCMutxOmtDPutxxmuECuuykmuFFuuzXmuGIuu0NkJg9muHuuuUxmvIiuvV1 \n' +
            'mvJmuvW5mvKquvX9mvLuuvYxmwMiuwZ1mwNmuwa5mwOquwb9mwPuuwcxmxQi \n' +
            'uxd1mxRmuxe5mxSquxPQoKG/mxUAuyIzu1JHuyVouyK5u1LPuyXAuzM/u1NH \n' +
            'uzYouzO1u2PPuzaAu0Q7u2RHu0bou0Sxu3TEsKUVu3ekC1eKsEV7u3X6C1fh \n' +
            'sBXRv+uFsAtoQrBGN7uBRgtop7B2nbuHbAtpBrA287uRogt5ZLBqZgt1Gbt1 \n' +
            'TLt1f7t1oruF1buGCLuGO7uGbruGkbuWxLuW97uXKbuZr7sZw7tZ5rtaCbta \n' +
            'LLtaT7taYrtqhbtqqLtqy7tq7rtrAbt7I7u+1auyN7uyebuyu7uy/buzP7uz \n' +
            'cbvDs7vD9bvEN7vEebvEu7vMxrrM4rstBrstKrstTrstYrs9hrs9qrs9zrs9 \n' +
            '4rtOBrtOKrtORbvucbr+lbr+ubr+3br+8bsPFbsPObsPXbsPcbsflbsfubsf \n' +
            '3LvP8LrwFMrwOMrwXMrwcMsAlMsAuMsA3MsA8MsRFMsRP+jLEVPLsXnKwZzK \n' +
            'wb/KwdLK0fXK0hjK0jvK0l7K0nHK4pTK4rfK4trLkvrLcxPMOAW8M3bLg5vM \n' +
            'OM28M/LLlBPMSYWwrl27wvHMN9O8M1PLg3nMOJu8M9/Lg/HMSVO8RFbLdHzM \n' +
            'VK/MVNLMZQXMZTjMZWjApZLAB6/L910McBDAKAPMBwMMgFrAWGfMA6kMgJrA \n' +
            'KMvMB58MgNjAGS/MAZUMkR/ACYPMGroLl63Ml7nLd9HMp+zLeAXMqB/LeDnM \n' +
            'qELLiG3MqHXLiJHMuKjLiMXMuNvLiPnMuQ7LiS3MuTHLmVHMyWTLmYXMyZfL \n' +
            'mvALWevMyfLLKi/MyjbLKmPM3+p6yyqnzNq+yyrrzNryyzsvzNs2yztjzOt6 \n' +
            'yzunzOu+yzvrzOvyy0wvzOw2y0xjzPx8y/ssCuzJzPzQzN/BzN1PzP1YzNAp \n' +
            '3N3FzQ3QzOCB3O5LzQ5YzODp3O7BzR7QzPFB3P9HzR9WwL+rzRAtDPHl0HAB \n' +
            '3SIDDQJA0HBn3SWpDQKq0DDN3SKvDQMJ0HEj3TGFDRNp0BGJ3TD4ALHK3PH9 \n' +
            '3PIg3QJT3QKG3QK53QLs3QMf3QNC3RN13ROo3RPN3TzPzT/BzU/zzUAl3UBX \n' +
            '3UCJ3UC73UDt3UEf3UFB3VFz3VVO3JVg3NWE3NWo3NXM3NXg3OYE3OYo3OZM \n' +
            '3OZg3+z2hNz2q91nrc1s/81tMc19c819tc19981+Oc1+e81+vc1+/81/Mc2I \n' +
            'JN2KJs2KaM2Kqs2K7M2LLs2LYM2bos2b5M2cJs2caM2Wut2aHM2aXs2akM2q \n' +
            '0s2rFM2rVs2rmM2r2s2sHM2sXs2lQN230s24BM24Ns24aM24ms24zM24/s25 \n' +
            'IM3JUs3JhM3D1t3CCN3Mpt0szt3CwN3dIt09Rt3TiN3drN0dyN3COt3Myd0s \n' +
            '4N3S8t3dRd09aN3Tt9C4LN1sbt3t8d3+JN3+V93+it37rQ3wuw4Jo9Bg7O2V \n' +
            '4Q4Z5NAxQO2jhw4aLtBBpO2gnQ4aZ9BiCO2jMw4qrNAyb+ztq90NMLvuIM/t \n' +
            'EO/uIPLtIRPuMSXtIUfuMVjtIXvuMYvtIa/uMb7tIdPuQeHtMgfuQhTtMjvu \n' +
            'QkftMm/uQnrtPBkM8sXuUt/swwnuUxPs003uU1fs04HuY5vs08XuY9/s1Anu \n' +
            'ZBPs5E3uZFfs5IHudJvs5MXudN/s5QnudRftnE0MlW/udXruWCvuVeXuhfLu \n' +
            'aIPuZmvuhnruaOvuZuHulvLueUPud2ful3rueavufIAOievgCDHupjYOik7g \n' +
            'WJfuo0wOiqjgOP3upOIOmwngCVPutngOm2PgObnus8sA+fDuiiPuilbuionu \n' +
            'irzuiu/uixLum0Xum3jum6vun+vN7rVv7rgh7shT7siF7si37sjp7skb7slN \n' +
            '7sl/7smh7t0s7i1K7l1u7l2C7m2m7m3K7m3u7m4C7n4m7n5K7n5n7uC57uWb \n' +
            '7uXd7uYf7uZR7vaT7vbV7vcX7vdZ7veb7v/O7vMA7wNC7wOE7wPG7wQI7wRK \n' +
            '7wSM7wTO7wUA7x5y7xL07xM27xN47xO67xP87xQ+7xRw7ySy7yT07y0m7yDo \n' +
            '7yEa7yFM7yF+7yGg7zHS7zIE7zI27zJo7zva7zo87zPp/qQC/0r070Rl/rSK \n' +
            '/0u+4N/I7uOs/zpu7zQM/qQk/0sm70SI/rSs/0n+70YB/1Y0/1Zn/1aa/1L9 \n' +
            'H1fZD+9xKPB3xP8U/w9xbfBYKP8W9Q+BrvAIjP8QSw+B5fBI4P8ggQ+SJvFr \n' +
            '2e95av96LO95rf96X+954P+Kgu+KI/+Kte+KZv+K6O+Kqf+LG++K7P+LTu+L \n' +
            'L/+Lce+bYv+bpuGn9++byP+Vm++cDP+V3++cQP+mE++shP+mV++syP+mm++t \n' +
            'DP+m3++tQP+3E++9hP+3V++9yP+w//HCve++Lv+8Ff/sJf/Ohv/Mm//srf/O \n' +
            '7v/NEf/9Jf/fRv/dl//9rf/frv/TMy/v7fB4CAJzhIWDj4hJiouJjY5fgIGf \n' +
            'n4RllpeVnpoLnJ2blJABoqOhpaZHqKmnqKwNrq+tr6Jzv+S1tre4ubq7vL2/ \n' +
            'vXBxwsPBxsaFzImLwoyRyJ+XzpKd1JWj2qip0Ku/3q6/0NHs5LTD58fI6nrP \n' +
            '7U3N4FDf82Pe9gbU+QnV/EzY8g/g8woK5yBPugO7ZOmbtm8aDRm3bPmr5s/b \n' +
            'gJvIjxX8FyB40lTLaQWcNnD6VFrDYRW8VtGVu63LWRXEdDHxmFlDQSU0lPJ0 \n' +
            'mlVLUS1suhRGXFJDYTWU1FN53ltLSTWk9RP7UFdVU0a8uj5pIeWtqo6aSnma \n' +
            'J+mlqq6qqrsbS6DchVmNevYNmJdUS2rNl6aEGpXcvW39vB4eIWm5uurt27eS \n' +
            'nt1dTX7999gQUTvtzLMDDEiev+3sXb+DHfvpMpB8aMOjNXI6y9xngNFoZssX \n' +
            'Jqk92A22yZ3Wg7+Fb7ITjb1MTHFWSNvDW618xhr5MNfba72tRtx8ONPTe93d \n' +
            'x53/MN/re+4OSF9yuO3viw5OyVF2oO3/mi6PSlR6qO3/ql7Py1d+oOoHejhE \n' +
            'egeKmUh6B53aTHIEzAtAehe/FNKF99FtqXX4b69cehfwF+KGCBIhqYYIkKNo \n' +
            'jiLhGuaASFLsZwYYwwaEijHB3euAGIOpYxYo8dmAjkBykOmQuLEb5IoYwX1q \n' +
            'ghjh3uCKKPIwZpIpFW1mIkhEhOqKSFTGboJIdQfiiliFSWeGWaf2TZ3pbxdV \n' +
            'nfl/n+hdnfmAGWWeCZCap5JZvsuQkfnPTJiR+d/NkJIJ4E6okgn1b6mRygzQ \n' +
            'kaHaHVGZodot0pGh6j5TlKJKTIScocpdBZSh2m2GnKHafgeUoeqEOKyhqpr5 \n' +
            'kqG6q1qYobq7u56huswcmaIq0t2orrjLrymqOvwP4oLLEoGmsrjLjqaiOvvv \n' +
            'IIrLBCSssgtcheu6y2znYbLbgNQnpAu5KKAC+lHMxrqRn2YgpAvpoawC+nHv \n' +
            'zrqbqzsthuwe6+CG/C8co4b8P01mhvxPfimG/F+u7Ib8b9+vhvxwAHKXCf7R \n' +
            'lM8sHwKYzywvQ5zPLD+EkM88T8WUzzxQBqjPPGBHrM88f+jYasJnIlD21yyk \n' +
            'ar3HLSLsfMtMw1P21zzlLr3HPVPgMNKtFaH3B01yIoDTYHTY9tBtRmAzB12g \n' +
            'ZYzbYHWMu6NdFeHx220mQ3fTbUak/dttVvZx13yXMbXXfSdzOd99N7S9131X \n' +
            '87Grjgg6NceMuHx5x4zYvn3HjPj/MZOcmTU165w5fDnDnNm+PcOc+fqxm6wa \n' +
            'MrXLrpp0ecusWra9y6x6+nGXvBsydce8O34557vrtn3HvHv18ZfLvDw1v8vM \n' +
            'fbm7zyy6/dvNvPExk919NXL/b12aO9fffef59i+NN/Xf31ZWe/PffNsz+k++ \n' +
            'PHbz796XePP/CFbhazm0XtZnFvu1nkbha7m0XvAgi9rd1ibreo2y3udou83W \n' +
            'Jvt+gbBEFXsl0YbRdJ2wXTdvG0XUhtF477IOAO4I2EeaNh3oiYNyrmjYx5w3 \n' +
            'ku7KEPfwjEIApxiEQsohGPiMQkKnGJTGyiE58IxShKcYpUrKIV0RMIADs=" />');
    }])


    .run(['$templateCache', function ($templateCache) {
        $templateCache.put("templates/colorpicker/area.html",
            '<area shape="poly" href="#" ng-blur="blur($event)">');
    }])


    .run(['$templateCache', function ($templateCache) {
        $templateCache.put("templates/colorpicker/map.html",
            '<map id="{{ name }}" name="{{ name }}">\n' +
            '    <color-picker-area \n' +
            '           ng-repeat="(c, p) in colormap track by c" \n' +
            '           ng-click="select(c, $event)" \n' +
            '           ng-attr-active="{{ $parent.isSelected(c) }}" \n' +
            '           coords="{{ p }}" alt="{{ c }}" /> \n' +
            '</map>');
    }])


    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('templates/colorpicker/colorpicker.html',
            '<div class="colorpicker" style="position:relative;"> \n' +
            '   <div color-picker-image></div> \n' +
            '   <div color-picker-map></div> \n' +
            '</div>');
    }]);
