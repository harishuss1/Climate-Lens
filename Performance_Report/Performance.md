# Performance of Climate Data Visualization project app

## Introduction and Methodology

<!-- Briefly state how you gathered data about app performance, and in what environment 
(which browsers, what browser versions, what kind of device, OS,
width and height of viewport as reported in the console with `window.screen`) -->

<!-- Also report overall impact on whatdoesmysitecost results before and after all your changes -->

## Baseline Performance

<!-- Summarize initial results for each tool that you used. Did the tools
detect all the performance issues you see as a user? -->

## Areas to Improve
The main areas that needed improvement were:

Caching: Enabling caching to reduce the number of network requests and allow the browser to use locally stored assets and data.

Optimize re-renders: Reducing unnecessary when props remain unchanged.

## Summary of Changes 

<!-- Briefly describe each change and the impact it had on performance (be specific). If there
was no performance improvement, explain why that might be the case -->

### Caching

Lead: Tommy Tran

Action: I configured the server to add cache control headers which allows the browser to cache static resource and API data for one year. Additionally, I added caching for API data on the server's memory with no TTL (Time to Live), as our historical emissions/temperature data do not change.

Impact: By setting a long cache duration for the browser and utilizing memory caching on the server, the page load times drastically improved. Subsequent visits loaded much faster, as the browser could reuse cached resources and the server didn't need to re-fetch the dataset.

Pre-Cache on AWS:
![No Cache AWS](./cacheReport/screenshots/NoCacheAWS.png)

Pre-Cache on Render:
![No Cache Render](./cacheReport/screenshots/NoCacheRender.png)

After-Cache on AWS:

After-Cache on Render:
![Cache Render](./cacheReport/screenshots/CacheRender.png)

---
### Unoptimized re-renders

Lead: Tommy Tran

Problem: Certain components (such as charts) were being re-rendered too frequently, even when their props hadn't changed. 
This happens every time the user selects a year or type anything in the country input field. 

Action: I added React.memo to wrap certain components (charts) that were being re-rendered too frequently. This change helped prevent re-renders of components unless their props changed. 

Impact: This significantly reduced unnecessary rendering during interactions with the user input on country/year selection. It also helps to optimize memory usage
In terms of performance, I didn't see any major improvement as the components themselves were not big.

Tool: I used the React Developer Tools' "Profiler" tab to check the re-rendering behavior

This issue could only be tested in development, as 'Profiler' is only available in development builds

Pre-optimization fix: Tested by changing the date selection input in our first view, and the result showed that all components in this parent component were being re-rendered
![unoptimized](./unoptimized_Rerender_Report/screenshots/unoptimized.png)


Post-optimization fix: Selecting a year or a country doesn't cause re-rendering on components.
![postOptimization](./unoptimized_Rerender_Report/screenshots/postMemo.png)

---
### Compression

Lead: Haris Hussain

Problem: Static assets such as JavaScript and CSS were being served uncompressed, resulting in large payloads and slow loading times, particularly on slower networks.

Action: To address the issue, I enabled Gzip Compression on the server using the compression middleware in the Express framework. This middleware ensured that all static files, such as .js, .css, and .html, were transmitted in a compressed format. Additionally, I focused on compressing large JSON API responses to further optimize the data payload. To verify the effectiveness of this change, I used the Network tab in Chrome DevTools, specifically checking for the Content-Encoding: gzip header in the server's response.

Impact: The implementation of Gzip Compression  reduced the size of transmitted assets, resulting in an improvement in the app's load time. This change directly improved metrics  particularly for users accessing the app on slower networks. Users experienced faster content delivery, which enhanced the overall usability of the app.

- Pre-compression:
  - load : 429ms
  - .js 952kb 8ms
  - .css 4.1kb 3ms
  - 2012 1.5kb 24ms (API)
  - 2012 513B 19ms (API)
  - 2013 383B 104ms (API)
- Post-compression
  - load : 395ms
  - .js 303kb 30ms
  - .css 1.5kb 3ms
  - 2012 583B 3ms (API)
  - 2012 536B 2ms (API)
  - 2013 406B 2ms (API)
  
Tool Used: Lighthouse and Chrome DevTools to verify compressed asset delivery and measure the performance improvement.



## Conclusion

<!-- Summarize which changes had the greatest impact, note any surprising results and list 2-3 main 
things you learned from this experience. -->