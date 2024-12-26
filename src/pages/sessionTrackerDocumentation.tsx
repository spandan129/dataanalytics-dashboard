import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from "lucide-react";
import UTMLinkGenerator from '../components/UtmLinkGenerator';

const SessionTrackerDocumentation: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'implementation' | 'referer'>('overview');
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(sessionTrackerCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copy status after 2 seconds
    };

    let domain_name = window.location.href;


    const sessionTrackerCode = `<script>(function(){const SessionTracker={pathHistory:[],userId:null,socket:null,socketStart:null,userLocation:null,videoData:[],contentData:[],observedElements:[],elementCount:0,elementObservers:{},buttonClickData:[],contentsButton:[],referrer:{},initObserver(){const getUTMParams=()=>{const params=new URLSearchParams(window.location.search);return{utm_source:params.get('utm_source')||'No Source',utm_medium:params.get('utm_medium')||'No Medium',utm_campaign:params.get('utm_campaign')||'No Campaign'};};this.referrer=getUTMParams();this.observer=new MutationObserver((mutations)=>{mutations.forEach((mutation)=>{if(mutation.addedNodes.length){const buttonContainer=document.querySelectorAll('#content-button');if(buttonContainer.length>0){buttonContainer.forEach((button)=>{const handleButtonClick=()=>{const title=button.getAttribute('title');const type=button.getAttribute('type');let existingButton=this.buttonClickData.find((b)=>b.content_title===title);if(!existingButton){this.buttonClickData.push({content_type:"button",click:1,content_title:title,contents_type:type});}else{existingButton.click+=1;}};button.addEventListener('click',handleButtonClick);});}const videoContainer=document.querySelector('#content-video');if(videoContainer){this.initializeTracking();this.observer.disconnect();}}const elements=document.querySelectorAll('#content');this.elementCount=elements.length;if(elements.length>0){elements.forEach((element)=>{const type=element.dataset.type;const title=element.title;const buttonElements=element.querySelectorAll('#inside-content-button');if(buttonElements.length>0){buttonElements.forEach((buttonElement)=>{const buttonTitle=buttonElement.getAttribute('title');const buttonType=buttonElement.getAttribute('type');const handleButtonClick=()=>{let existingButton=this.contentsButton.find((b)=>b.content_title===buttonTitle&&b.contents_type===buttonType);if(!existingButton){this.contentsButton.push({content_type:"button",click:1,content_title:buttonTitle,contents_type:buttonType,parent_content_title:title});}
else{existingButton.click+=1;}};buttonElement.addEventListener('click',handleButtonClick);});}const existingContent=this.contentData.find(content=>content.content_title===title);if(!existingContent){const rect=element.getBoundingClientRect();const isFullyVisible=(rect.top>=0)&&(rect.bottom<=window.innerHeight);if(isFullyVisible){this.pushContentData(element,type,title);}else{this.setupIntersectionObserver(element,type,title);}}});}});});this.observer.observe(document.body,{childList:true,subtree:true});if(this.elementCount.length>0){window.addEventListener('beforeunload',()=>{this.updateAllContentDataOnExit();});}},initializeTracking(){const videoElements=document.querySelectorAll('#content-video');if(videoElements.length>0){videoElements.forEach(video=>this.setupVideoTracking(video));}},setupVideoTracking(video){const title=video.title;const initialVideoObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>=0.6){this.setupVideoEvents(video,title);initialVideoObserver.disconnect();}});},{threshold:0.6});initialVideoObserver.observe(video);},setupVideoEvents(video,title){let currentVideoObject=null;let currentSessionObject=null;const createNewSession=()=>{return{start_time:new Date().toISOString(),end_time:null,duration:0,completed:false};};const initializeVideoObject=()=>{return{content_type:"video",title:title,started_watching:new Date().toISOString(),last_interaction:new Date().toISOString(),total_watch_time:0,session_information:[],ended:false};};const pushVideoContent=()=>{const existingVideo=this.videoData.find(v=>v.title===title&&!v.ended);if(!existingVideo){currentVideoObject=initializeVideoObject();this.videoData.push(currentVideoObject);}else{currentVideoObject=existingVideo;}currentSessionObject=createNewSession();currentVideoObject.session_information.push(currentSessionObject);currentVideoObject.last_interaction=new Date().toISOString();};const handlePause=()=>{if(currentVideoObject&&currentSessionObject&&!currentSessionObject.end_time){const endTime=new Date().toISOString();
currentSessionObject.end_time=endTime;currentSessionObject.duration=(new Date(endTime)-new Date(currentSessionObject.start_time))/1000;currentVideoObject.total_watch_time+=currentSessionObject.duration;currentVideoObject.last_interaction=endTime;}};const handleEnded=()=>{handlePause();if(currentVideoObject){currentVideoObject.ended=true;currentVideoObject.ended_time=new Date().toISOString();if(currentSessionObject){currentSessionObject.completed=true;}}};if(video.autoplay){video.addEventListener('playing',()=>{if(!currentVideoObject||!currentSessionObject){pushVideoContent();}},{once:true});}video.addEventListener('play',()=>{pushVideoContent();});video.addEventListener('pause',handlePause);video.addEventListener('ended',handleEnded);const exitVideoObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(!entry.isIntersecting){handlePause();}});},{threshold:0});exitVideoObserver.observe(video);document.addEventListener('visibilitychange',()=>{if(document.hidden){handlePause();}});window.addEventListener('beforeunload',handlePause);},setupIntersectionObserver(element,type,title){if(!this.observedElements.includes(title)){const initialObserver=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>=0.2){this.pushContentData(element,type,title);const exitObserver=new IntersectionObserver((exitEntries)=>{exitEntries.forEach(exitEntry=>{if(exitEntry.intersectionRatio===0){this.updateContentDataOnExit(title);exitObserver.disconnect();}});},{threshold:0});exitObserver.observe(element);this.elementObservers[title]={initialObserver:initialObserver,exitObserver:exitObserver};initialObserver.disconnect();}});},{threshold:[0.2]});initialObserver.observe(element);this.observedElements.push(title);}},pushContentData(element,type,title){const existingContent=this.contentData.find(content=>content.content_title===title);if(!existingContent){this.contentData.push({content_type:type,content_title:title,start_watch_time:new Date().toISOString(),scrolled_depth:0,isactive:true});this.trackContentScroll(element,title);}},
trackContentScroll(element,title){const checkScrollDepth=()=>{const rect=element.getBoundingClientRect();const elementHeight=element.offsetHeight;const visibleHeight=Math.min(window.innerHeight,rect.bottom)-Math.max(0,rect.top);const scrolledPercentage=(visibleHeight/elementHeight)*100;const content=this.contentData.find((content)=>content.content_title===title);if(content&&content.scrolled_depth!==100){content.scrolled_depth=scrolledPercentage.toFixed(0);}};window.addEventListener('scroll',checkScrollDepth);},updateContentDataOnExit(title){const content=this.contentData.find((c)=>c.content_title===title);if(content){content.ended_watch_time=new Date().toISOString();}const active_content=this.contentData.find((c)=>c.isactive===true&&c.content_title===title);if(active_content){active_content.isactive=false;}},updateAllContentDataOnExit(){this.contentData.forEach(content=>{if(!content.ended_watch_time||content.isactive){content.ended_watch_time=new Date().toISOString();}});},getLocation(){return new Promise((resolve,reject)=>{if(!navigator.geolocation){resolve(null);}navigator.geolocation.getCurrentPosition((position)=>{resolve({latitude:position.coords.latitude,longitude:position.coords.longitude});},(error)=>{resolve(null);});});},setupNavigationTracking(){window.addEventListener('popstate',()=>{this.updatePathHistory();});const originalPushState=history.pushState;const originalReplaceState=history.replaceState;history.pushState=function(){originalPushState.apply(this,arguments);SessionTracker.updatePathHistory();};history.replaceState=function(){originalReplaceState.apply(this,arguments);SessionTracker.updatePathHistory();};},async init(){try{this.initObserver();this.userLocation=await this.getLocation();this.updatePathHistory();await this.setupWebSocket();this.setupNavigationTracking();}catch(error){console.error('Error initializing session tracker:',error);}},updatePathHistory(){const currentPath=window.location.pathname;if(currentPath!==this.pathHistory[this.pathHistory.length-1]){this.pathHistory.push(currentPath);}},async handleUserCreation(){try{let userId=localStorage.getItem("userId");
if(!userId){const response=await fetch("http://localhost:8000/create_user");if(!response.ok){throw new Error("HTTP error! status:"+response.status);}const data=await response.json();userId=data.user_id;localStorage.setItem("userId",userId);}this.userId=userId;return userId;}catch(error){console.error('Error creating user:',error);throw error;}},async setupWebSocket(){try{await this.handleUserCreation();this.socketStart=new Date();this.socket=new WebSocket("ws://localhost...");}};SessionTracker.init();})();</script>
`


    return (
        <div className=" mx-auto p-14 font-archivo">
            <h1 className="text-3xl font-bold mb-6 ">Interaction Tracker Documentation</h1>

            <div className="flex mb-4 border-b">
                <button
                    className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-indigo-700 text-indigo-800' : 'text-black/90'}`}
                    onClick={() => setActiveTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'implementation' ? 'border-b-2 border-indigo-700 text-indigo-800' : 'text-black/90'}`}
                    onClick={() => setActiveTab('implementation')}
                >
                    Implementation
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'code' ? 'border-b-2 border-indigo-700 text-indigo-800' : 'text-black/90'}`}
                    onClick={() => setActiveTab('code')}
                >
                    Code
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'referer' ? 'border-b-2 border-indigo-700 text-indigo-800' : 'text-black/90'}`}
                    onClick={() => setActiveTab('referer')}
                >
                    Referer Link Generator
                </button>

            </div>

            {activeTab === 'overview' && (
                <>
                    <div className="p-8 ">
                        <h2 className="text-3xl font-bold mb-6 text-gray-800">Interaction Tracker Overview</h2>

                        <p className="text-lg text-black/90 mb-6">
                            The Interaction Tracker is a comprehensive JavaScript module designed to capture and track user interactions across a website. It provides detailed insights into:
                        </p>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-black mb-4">Core Metrics</h3>
                            <ul className="list-disc pl-5 text-black/90 space-y-2">
                                <li><strong>Total Visitors:</strong> Unique individual users accessing the platform</li>
                                <li><strong>Total Visits:</strong> Cumulative number of site/application interactions</li>
                                <li><strong>Live Users:</strong> Real-time count of currently active users</li>
                                <li><strong>Average Session Time:</strong> Mean duration of user engagement</li>
                                <li><strong>Page Views:</strong> Detailed tracking of interactions across different pages</li>
                                <li><strong>Bounce Rate:</strong> Percentage of users leaving without significant interaction</li>
                            </ul>
                        </div>

                        <p className="text-lg text-black/90 mb-8">
                            The tracker uses modern web APIs like <span className="font-semibold">MutationObserver</span>, <span className="font-semibold">IntersectionObserver</span>, and <span className="font-semibold">WebSocket</span> to capture comprehensive user interaction data.
                        </p>

                        <div className="mb-8">
                            <h3 className="text-2xl font-semibold text-black mb-4">User Behavior Analytics</h3>
                            <ul className="list-disc pl-5 text-black/90 space-y-2">
                                <li><strong>Browser Detection:</strong> Identifying user's web browser type</li>
                                <li><strong>Operating System:</strong> Recognizing device platform (Windows, macOS, Linux, etc.)</li>
                                <li><strong>Device Classification:</strong> Categorizing as mobile or desktop</li>
                                <li><strong>Referrer Source:</strong> Tracking origin of user entry point</li>
                                <li><strong>Campaign Tracking:</strong> Identifying marketing channels and mediums</li>
                                <li><strong>Geographical Distribution:</strong> User location-based heat map analysis</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-2xl font-semibold text-black mb-4">Content Interaction Monitoring</h3>
                            <ul className="list-disc pl-5 text-black/90 space-y-6">
                                <li>
                                    <strong>Element-Level Tracking:</strong>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Capture interactions with specific page components</li>
                                        <li>Requires unique tracking ID</li>
                                        <li>Needs element type and title specification</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Video Interaction:</strong>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Track view duration</li>
                                        <li>Monitor video completion status</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Content Visibility:</strong>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Analyze time spent on content sections</li>
                                        <li>Measure scroll depth and engagement</li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Button Click Tracking:</strong>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Log precise interaction details</li>
                                        <li>Capture context of interactions</li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>


                </>
            )}



            {activeTab === 'implementation' && (
                <div className="p-8">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Implementation Guide</h2>

                    <div className="mb-4">
                        <h3 className="font-semibold text-black text-2xl mb-2">1. HTML Setup</h3>
                        <p className="mb-2">Add specific attributes to your HTML elements to enable tracking:</p>
                        <p>Note: To enable tracking tittle and type is necessary</p>
                        <SyntaxHighlighter language="html" style={dracula}>
                            {`<!-- Video tracking -->
<video id="content-video" title="Video Title" autoplay>
  <!-- Video content -->
</video>

<!-- Content tracking -->
<div id="content" data-type="article" title="Article Title">
  <!-- Content elements -->
  
  <!-- Button tracking within content -->
  <button id="inside-content-button" 
          title="Button Title" 
          type="action-type">
    Click Me
  </button>
</div>

<!-- Global buttons -->
<button id="content-button" 
        title="Global Button Title" 
        type="global-action-type">
  Global Action
</button>

<!-- Video -->
<video
id="content-video"
title="Impact Video"
controls
className="w-full max-w-3xl mx-auto"
>
</video>`}
                        </SyntaxHighlighter>
                    </div>

                    <div className="mb-4">
                        <h3 className="font-semibold text-black text-2xl  mb-2">2. Script Inclusion</h3>
                        <p className="mb-2">Add the script before the closing body tag or in the head with a DOMContentLoaded listener:</p>
                        <p>Note: The script will be available in the code section , copy and paste it.</p>
                        <SyntaxHighlighter language="html" style={dracula}>
                            {`<head>
  <script src="path/to/session-tracker.js"></script>
</head>
<!-- OR -->
<body>
  <script src="path/to/session-tracker.js"></script>
</body>`}
                        </SyntaxHighlighter>
                    </div>




                </div>
            )}

            {activeTab === 'code' && (
                <div className="p-6 ">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Interaction Tracker Code</h2>
                    <SyntaxHighlighter language="javascript" style={dracula}>
                        {sessionTrackerCode}
                    </SyntaxHighlighter>
                    <div className='w-full flex justify-end '>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1 px-2 py-1 text-sm bg-[#0d0d36] border text-white border-gray-300 rounded shadow hover:bg-[#28282a] focus:outline-none"
                        >
                            <Copy size={16} />
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                </div>
            )}
            {activeTab === 'referer' && (
                <div className="p-6 ">

                    <UTMLinkGenerator />
                </div>
            )}
        </div>
    );
};

export default SessionTrackerDocumentation;