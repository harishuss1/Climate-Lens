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
### <!-- Change n -->

Lead: <!-- name of main contributor to this change -->

## Conclusion

<!-- Summarize which changes had the greatest impact, note any surprising results and list 2-3 main 
things you learned from this experience. -->