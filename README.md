# New York City Data Visualization

## Topic

Crime in New York State

## TODO (updated April 1st, 2019)
- [x] Three interactions: details, brushing & linking, filter
- [ ] User Testing
- [ ] Move back from Vega Editor onto web page
- [ ] Usability Report

## Ideation

Top Down Question(s)
- How to mitigate and prevent crime in NYC

Bottom Up Questions(s)
- Which County of NY state has the most crime?
- Does a County's population and it's economic status affect crime rate?
- What is the dominate race in the County?
- Does type of transportation affect type of crime count?
- Does employment type affect crime count? 

## Data Sources
- [NYC Crime Index 1](https://www.kaggle.com/new-york-state/new-york-state-index-crimes)
- [NYC Crime Index 2](https://www.kaggle.com/new-york-state/nys-index,-violent,-property,-and-firearm-rates)
- [NYC Census Data](https://www.kaggle.com/muonneutrino/new-york-city-census-data#nyc_census_tracts.csv)

## Libraries
- Vega
- VegaLite
- VegaEmbed
  
## Visualization Plans
**Notes**
County in Crime Index 1 needs to be from 2015 to match Crime Index 2

### Visualization (1)
- Type: Scatter plot
- Interaction: Brushing and Linking
- X axis: Population count
- Y axis: Income number
- Points ploted: County 
- Without the brushing and linking: heat map of Crime Count
- Details on Demand: hover on a point shows the county's name, population and income
- Action: When you brush the County points, it links and changes the other visualizations info 
  
### Visualization (2)
- Type: Map 
- Interaction: Linked with Visualization (1) (Techincally also is like details on demand)
- Action: The county that was brushed in Visualization (1) will be more apparant 
- Detail: On the county in the map, will show the Crime Count, Property Crime Count, Violent Crime Count and Firearm Crime Count.
- Consider: Heat Map to show Crime Count and/or then filter heat map for type of crime counts
- Consider 2: Doing the consideration for heat map, this allows us to hover the number for details on demand
  
### Visualization (3)
- Type: Circle Graph
- Interaction: Linked with Visualization (1)
- Action: The circle is based on the sum of the category (Transportation Types/Employment Types/Ethnicity Types) and the circle breaks down by the category's types
- The category that loads is race
- Consider: Detail on Demand for the calculation of type percentage and population count
- Consider 2: The circle can change size based on the sum of the category
- Consider 3: Detail on Demand for Number of Men and Number of Women
  