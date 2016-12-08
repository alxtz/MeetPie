from bs4 import BeautifulSoup
import time
from selenium import webdriver
import string
import json

class eventObject:
    title = "" #
    start_date = "" #
    end_date = ""
    url = "" #
    description = "" #
    source = "Meetup" #
    host = "" #
    location = "" #
    fee = "0" #
    number_of_people = "" #
    image_url = "" #

jsonString = json.dumps([])
eventJsonObject = json.loads(jsonString)
eventObjectList = []
nowEventObject = eventObject()
chromeDriver = None
sourceCode = None
meetupUrl = 'https://www.meetup.com/find/events/?allMeetups=true&radius=100&userFreeform=TW&gcResults=Taiwan%3ATW%3Anull%3Anull%3Anull%3Anull%3Anull%3A23.69781%3A120.96051499999999&change=yes'

def parseInt(string):
    return int(''.join([x for x in string if x.isdigit()]))

def initChromeDriver():
    global chromeDriver
    chromeDriver = webdriver.Chrome()
    time.sleep(2)

def getPage(inputUrl):
    global chromeDriver
    chromeDriver.get(inputUrl)
    time.sleep(3)

def getSourceCode():
    global sourceCode
    sourceCode = chromeDriver.page_source
    #print('The Source Code is',sourceCode)

def getChildPage(childUrl , index):
    global chromeDriver
    chromeDriver.get(childUrl)
    time.sleep(4)
    childSourceCode = chromeDriver.page_source

    soup = BeautifulSoup(childSourceCode, 'html.parser')
    body = soup.find('body')
    global eventObjectList

    whereLi = body.find('li',{'id':'event-where'})
    if whereLi == None:
        print('Location Hidden!')
    else:
        if whereLi.has_attr('data-name') and whereLi.has_attr('data-address'):
            eventObjectList[index-1].location = whereLi['data-name'] + ' - ' + whereLi['data-address'].replace('<span>','').replace('</span>','')
            print('Location',eventObjectList[index-1].location)
        else:
            print('Needs a Location!')

    photoImg = body.find('img',{'class':'photo'})
    if photoImg == None:
        print('Photo Hidden!')
    else:
        eventObjectList[index-1].image_url = photoImg['src']
        print('img',eventObjectList[index-1].image_url)

    desDiv = body.find('div',{'id':'event-description-wrap'})
    if desDiv == None:
        print('No Description!')
    else:
        eventObjectList[index-1].description = desDiv.getText().replace('\n','')
        print('介紹:',eventObjectList[index-1].description)

    whenLi = body.find('div',{'id':'event-when-display'})
    if whenLi == None:
        print('No Date!')
    else:
        eventObjectList[index-1].start_date = whenLi.find('time')['datetime']
        eventObjectList[index-1].end_date = whenLi.find('time')['datetime']
        print('startDate is',eventObjectList[index-1].start_date)

def getElements():
    global sourceCode
    soup = BeautifulSoup(sourceCode, 'html.parser')

    global eventObjectList
    body = soup.find('body')

    eventLinks = body.findAll('a',{'class':'event'})
    print('There are ',len(eventLinks),' events')
    eventObjectList = [eventObject() for i in range(len(eventLinks))]
    i = 0
    for eventLink in eventLinks:
        i+=1
        print(i,eventLink.find('span').text)
        eventObjectList[i-1].title = eventLink.find('span').text
        print(i,'Url',eventLink['href'])
        eventObjectList[i-1].url = eventLink['href']
        getChildPage(eventLink['href'] , i)

    hostDivs = body.findAll('div',{'class':'text--labelSecondary'})
    print('There are ',len(hostDivs),' hosts')
    i = 0
    for hostDiv in hostDivs:
        i+=1
        print(i,hostDiv.find('a').find('span').text)
        eventObjectList[i-1].host = hostDiv.find('a').find('span').text

    attendDivs = body.findAll('div',{'class':'attendee-count'})
    print('There are',len(attendDivs),'attend types')
    i = 0
    for attendDiv in attendDivs:
        i+=1
        print('第',i,'個活動有',parseInt(attendDiv.find(text=True, recursive=False)),'人')
        eventObjectList[i-1].number_of_people = parseInt(attendDiv.find(text=True, recursive=False))



initChromeDriver()
getPage(meetupUrl)
getSourceCode()
getElements()

for i in range(len(eventObjectList)):
    eventJsonObject.append({'title':eventObjectList[i].title,'start_date':eventObjectList[i].start_date,'end_date':eventObjectList[i].end_date,'url':eventObjectList[i].url,'description':eventObjectList[i].description,'source':eventObjectList[i].source,'host':eventObjectList[i].host,'location':eventObjectList[i].location,'fee':eventObjectList[i].fee,'number_of_people':eventObjectList[i].number_of_people,'image_url':eventObjectList[i].image_url})

jsonFile = open("../../Crawler-Result-JSON-Raw/Crawler-Result-Raw-Meetup.json", "w")
jsonFile.write( json.dumps(eventJsonObject) )

chromeDriver.quit()
