from bs4 import BeautifulSoup
import time
from selenium import webdriver
import string
import json

class eventObject:
    title = "" #
    start_date = "" #
    end_date = "" #
    url = ""
    description = "" #
    source = "ACCUPASS" #
    host = ""
    location = ""
    fee = "0" #
    number_of_people = "0" #
    image_url = "" #

jsonString = json.dumps([])
eventJsonObject = json.loads(jsonString)

chromeDriver = None
sourceCode = None
accupassHeadUrl = 'https://www.accupass.com/search/r/0/0/0/0/2/'
accupassFootUrl = '/00010101/99991231'
eventObjectList = []

jsonIndex = 0

def initChromeDriver():
    global chromeDriver
    chromeDriver = webdriver.Chrome()
    time.sleep(2)

def getOnePage(inputUrl):
    global chromeDriver
    chromeDriver.get(inputUrl)
    time.sleep(3)

def getSourceCode():
    global sourceCode
    sourceCode = chromeDriver.page_source

def soupOnePage():
    global sourceCode
    soup = BeautifulSoup(sourceCode, 'html.parser')
    body = soup.find('body')

    if body.find('div',{'class':'apcss-search-nofound-info'}) != None:
        print('最後一頁')
        return False
    else:
        print('不是最後一頁')

    print('開始爬')

    global eventObjectList

    eventDivs = body.findAll('div',{'class':'col-md-4'})

    global jsonIndex

    for eachEventDiv in eventDivs:
        jsonIndex = jsonIndex + 1
        eachEventJsonObject = eventObject()
        eventObjectList.append({'title':'','start_date':'','end_date':'','url':'','description':'','source':'ACCUPASS','host':'','location':'','fee':'0','number_of_people':'0','image_url':''})

        eachTitle = eachEventDiv.find('h3',{'class':'apcss-activity-card-title'})
        eventObjectList[jsonIndex-1]['title'] = eachTitle.getText().replace(' ','').replace('\n','')
        print(eachTitle.getText().replace(' ','').replace('\n',''))

        eachStartDate = eachEventDiv.find('p',{'class':'apcss-activity-card-date'})
        eventObjectList[jsonIndex-1]['start_date'] = eachStartDate.getText().replace(' ','').replace('\n','')
        eventObjectList[jsonIndex-1]['end_date'] = eachStartDate.getText().replace(' ','').replace('\n','')
        print(eachStartDate.getText().replace(' ','').replace('\n',''))

        desDiv = eachEventDiv.find('div',{'class':'apcss-activity-card-body'})
        eventObjectList[jsonIndex-1]['description'] = desDiv.findAll(text=True,recursive=False)[2].replace(' ','').replace('\n','')
        print(eventObjectList[jsonIndex-1]['description'])

        eachImg = eachEventDiv.find('img')
        eventObjectList[jsonIndex-1]['image_url'] = eachImg['src']
        print(eventObjectList[jsonIndex-1]['image_url'])

        eachA = eachEventDiv.find('a',{'class':'apcss-activity-card-image'})
        eventObjectList[jsonIndex-1]['url'] = 'https://www.accupass.com' + eachA['ng-href']
        print(eventObjectList[jsonIndex-1]['url'])

        getChildPage(eventObjectList[jsonIndex-1]['url'])

def getChildPage(childUrl):
    global jsonIndex

    global chromeDriver
    chromeDriver.get(childUrl)
    time.sleep(3)
    childSourceCode = chromeDriver.page_source
    soup = BeautifulSoup(childSourceCode, 'html.parser')
    body = soup.find('body')

    if body.find('a',{'class':'event-organizer'}) == None:
        print('Get Child Page Error , Try Again')
        chromeDriver.get(childUrl)
        time.sleep(10)
        nonlocal childSourceCode
        nonlocal soup
        nonlocal body
        childSourceCode = chromeDriver.page_source
        soup = BeautifulSoup(childSourceCode, 'html.parser')
        body = soup.find('body')

    global eventObjectList
    eventObjectList[jsonIndex-1]['host'] = body.find('a',{'class':'event-organizer'}).findAll(text=True,recursive=False)[1].replace(' ','').replace('\n','')
    print (body.find('a',{'class':'event-organizer'}).findAll(text=True,recursive=False)[1].replace(' ','').replace('\n',''))

    eventObjectList[jsonIndex-1]['location'] = body.find('a',{'gtm-name':'address'}).getText().replace(' ','').replace('\n','')

    print(eventObjectList[jsonIndex-1]['location'])

initChromeDriver()

for i in range(1000):
    getOnePage(accupassHeadUrl+str(i)+accupassFootUrl)
    getSourceCode()
    isContinue = soupOnePage()
    if isContinue == False:
        print('isContinue is False')
        break
    else:
        print('isContinue is True')
    print('第',i+1,'頁')

chromeDriver.quit()

print (json.dumps(eventObjectList, indent=4, sort_keys=True,ensure_ascii=False))

jsonFile = open('../../Crawler-Result-JSON-Raw/Crawler-Result-Raw-ACCUPASS.json','w')
jsonFile.write(json.dumps(eventObjectList, indent=4, sort_keys=True,ensure_ascii=False))
