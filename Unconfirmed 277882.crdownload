# The purpose of this program is the calculate the variables for eBold/eImprove
# It works with both international data and US data
# To get 'estimates_with_consensus' you can use the 'calculate_consensus' function or you can import 
# 'estimates_with_consensus as 'df_estimates' and comment out the 'calculate_consensus' function call

import pandas as pd
import numpy as np
import time

# Import the function from calculate_consensus.py
from calculate_consensus import df_add_consensus

print("after importing consensus")

pd.set_option("display.max_rows", 1000)

df_actuals = pd.read_csv("Source_Data/INTL/Full_Dataset_IBES_Actuals.csv")
df_estimates = pd.read_csv("estimates_with_consensus.csv")


#Prepare df_actuals dataframe so it can be merged to df_estimates and used to calculate EIMPROVE and EBOLD
#Rename columns
df_actuals = df_actuals.rename(columns={'ANNDATS': 'QTRANNDATE', 'ANNTIMS':'QTRANNTIME', 'PDICITY':'QTRPDICITY', 'PENDS':'QTREND'})

#Drop all of the variables from actuals that I do not need
df_actuals = df_actuals[['TICKER', 'CUSIP', 'QTRANNDATE', 'QTRANNTIME', 'QTRPDICITY', 'QTREND']]


# peek at data types
variable_types =df_estimates.dtypes
print("variable types", variable_types)


# Convert the forecast dates and announcement dates into 'datetime64' variables
# The 'Trimmed' Dataset and the full dataset have different formats (format="%Y%m%d" for trimmed and format='%Y-%m-%d' for full)
# If you are using 'estimates_with_consensus.csv' (dataset output from running calculate_consensus) then remove format completely
df_estimates['ACTDATS'] = pd.to_datetime(df_estimates['ACTDATS'])
df_estimates['ANNDATS_ACT'] = pd.to_datetime(df_estimates['ANNDATS_ACT'])
df_actuals['QTRANNDATE'] = pd.to_datetime(df_actuals['QTRANNDATE'])
df_estimates['FPEDATS'] = pd.to_datetime(df_estimates['FPEDATS'])


# Create a lagged "VALUE" variable called "LAG_VALUE"
# Sort DataFrame by 'CUSIP', 'FPEDATS', 'DATE', and 'TIME'
df_estimates.sort_values(['CUSIP', 'FPEDATS', 'ACTDATS', 'ACTTIMS'], inplace=True)

# Create 'LAG_VALUE' column with lagged values based on 'CUSIP' on 'FPEDATS'
df_estimates['LAG_VALUE'] = df_estimates.groupby(['CUSIP', 'FPEDATS'])['VALUE'].shift()

# Add consensus variable
# df_add_consensus(df_estimates)

print("We are here")

def create_eBold_eImprove(df_estimates, df_actuals):

    # Record the start time
    start_time_e = time.time()

    variable_types =df_actuals.dtypes
    print("variable types", variable_types)

    # Prepare to create QTRLY ANNOUNCEMENT DATE variable 
    #Sort by CUSIP
    df_actuals.sort_values(['CUSIP', 'QTRANNDATE'], inplace=True)

    # create a giant object that has all announcement dates (number of years times 4) for each company
    # create an empty giant object
    giantObject = {}
    announcementDates = []

    lag_cusip=None
    counter_sum=0

    # Get the maximum index value
    max_index = df_actuals.index.max()

    print("Start first ebold for loop")

    # loop through each row in the dataset with the announcement dates
    for index, row in df_actuals.iterrows():
        # get the current ticker and announcement date
        cusip = row['CUSIP']
        date = row['QTRANNDATE']
        # print("Cusip", cusip, counter_sum, max_index, date)
                
        #check if the cusip changed and if it did, put announcement dates array in giant object, clear announcement dates and set lag_cusip as blank
        if cusip!=lag_cusip:
            giantObject[lag_cusip] = announcementDates
            announcementDates = []
            lag_cusip=None
                
        announcementDates.append(date)

        # create a lag cusip variable
        lag_cusip = cusip

        # Check if it is the last row
        if counter_sum == max_index:
            # If it is the last row then add the cusip with announcementDates to giantObject
            giantObject[cusip] = announcementDates
           
        # Increment counter_sum
        counter_sum = counter_sum + 1

    # Record the end time
    end_time_e_loop_1 = time.time()

    # Calculate the elapsed time
    elapsed_time_e_loop_1 = end_time_e_loop_1 - start_time_e

    # Print the elapsed time
    print("Elapsed time:", elapsed_time_e_loop_1, "seconds for first for loop of ebold/eimprove")

    print("start second eBold for loop")

    # print("giantObject", giantObject)

    # loop through each row in estimates dataset to create announcement_date variable 
    for index, row in df_estimates.iterrows():
        # get the current cusip and announcement date
        date = row['ACTDATS']
        cusip = row['CUSIP']
        # make sure that the cusip actually exists (meaning it was present in the last dataset)
        if cusip in giantObject:
            announcementDates = giantObject[cusip]
            # print("Forecast Date", date)
            # print(giantObject[cusip])        
            # loop through the array of announcement dates and if any meets the criteria, set it as the announcement_date variable 
            for i in range(len(announcementDates)):
                difference = date - announcementDates[i]
                if difference.days>=-30 and difference.days<=30:                
                    df_estimates.loc[index, 'QTR_ANN_DATE'] = announcementDates[i]                        
                    # break

    # Record the end time
    end_time_e_loop_2 = time.time()

    # Calculate the elapsed time
    elapsed_time_e_loop_2 = end_time_e_loop_2 - end_time_e_loop_1

    # Print the elapsed time
    print("Elapsed time:", elapsed_time_e_loop_2, "seconds for second for loop of ebold/eimprove")
           
                    
    # calculate the difference in days between ACTDATS and ANNDATS
    diff_days = (df_estimates['ACTDATS'] - df_estimates['QTR_ANN_DATE']).dt.days

    # create a new column PERIOD with modified conditions
    df_estimates['PERIOD'] = ''
    df_estimates.loc[(diff_days > -31) & (diff_days < -10), 'PERIOD'] = 'EarlyDiscovery'
    df_estimates.loc[(diff_days > -11) & (diff_days < 0), 'PERIOD'] = 'LateDiscovery'
    df_estimates.loc[(diff_days > -1) & (diff_days < 3), 'PERIOD'] = 'EarlyAnalysis'
    df_estimates.loc[(diff_days > 2) & (diff_days < 5), 'PERIOD'] = 'LateAnalysis'
    df_estimates.loc[(diff_days > 4) & (diff_days <= 30), 'PERIOD'] = 'PostAnalysis'
   
    # Now that the consensus has been calculated, eliminate those observations where PERIOD is blank
    df_estimates = df_estimates[df_estimates['PERIOD'] != '']

    # Drop rows where 'LAG_VALUE' is empty
    df_estimates = df_estimates.dropna(subset=['LAG_VALUE'])

    # Calculate the date difference between actual_date and current_date (save AGE)
    df_estimates['AGE'] = (df_estimates['ANNDATS_ACT'] - df_estimates['ACTDATS']).dt.days

    # trim the dataset so you do not have any forecasts after the announcement date 
    # Calculate the date difference between actual_date and current_date (save AGE)
    df_estimates['SPREAD'] = (df_estimates['FPEDATS'] - df_estimates['ACTDATS']).dt.days

    # Filter rows where the forecast is after the forecast period end date
    # MANY OBSERVATIONS LOST WHEN REQUIREMENT PUT IN PLACE (NOT PROBLEM WITH EBOLD/EIMPROVE)
    df_estimates = df_estimates[df_estimates['SPREAD'] > 9]

    # peek at data types
    # variable_types =df_estimates.dtypes
    # print("variable types", variable_types)

    # label each forecast as bold or improve to calculate eBold or eImprove (use UPPER and LOWER to calculate BOLD)
    df_estimates['IMPROVE'] = df_estimates.apply(lambda row: 1 if abs(row['VALUE']-row['ACTUAL']) < abs(row['ACTUAL']-row['lag_consensus']) else 0, axis=1)
    df_estimates['UPPER'] = df_estimates.apply(lambda row: row['lag_consensus'] if row['lag_consensus'] > row['prior_forecast'] else row['prior_forecast'], axis=1)
    df_estimates['LOWER'] = df_estimates.apply(lambda row: row['lag_consensus'] if row['lag_consensus'] < row['prior_forecast'] else row['prior_forecast'], axis=1)
    df_estimates['BOLD'] = df_estimates.apply(lambda row: 1 if (row['VALUE']>row['UPPER']) | (row['VALUE'] < row['LOWER'])  else 0, axis=1)
    # if PERIOD or LAG_CONSENSUS is empty then IMPROVE and BOLD should be 0
    df_estimates.loc[(df_estimates['PERIOD'] == '') | (df_estimates['lag_consensus'].isnull()) | (df_estimates['lag_consensus'] == ''), 'IMPROVE'] = 0
    df_estimates.loc[(df_estimates['PERIOD'] == '') | (df_estimates['lag_consensus'].isnull()) | (df_estimates['lag_consensus'] == '') | (df_estimates['prior_forecast'].isnull()) | (df_estimates['prior_forecast'] == ''), 'BOLD'] = 0

    # output the trimmed DataFrame to a CSV file so I can view it
    df_estimates.to_csv('output_IBES_bold.csv', index=False)

    # Create a new column 'EarlyBold' and 'EarlyImprove'
    df_estimates['EarlyBold'] = 0
    df_estimates.loc[(df_estimates['BOLD'] == 1) & (df_estimates['PERIOD'].str.startswith('Early')), 'EarlyBold'] = 1
    df_estimates['EarlyImprove'] = 0
    df_estimates.loc[(df_estimates['IMPROVE'] == 1) & (df_estimates['PERIOD'].str.startswith('Early')), 'EarlyImprove'] = 1

    # Group by 'cusip' and 'fpedats' columns and aggregate the data to create firm-year observations
    summary = df_estimates.groupby(['CUSIP', 'FPEDATS']).agg(
        ANNDATE=('ANNDATS_ACT', 'max'),  
        OBS_eBold=('CUSIP', 'count'),
        BOLD_Total=('BOLD', 'sum'),
        IMPROVE_Total=('IMPROVE', 'sum'),
        EarlyBold=('EarlyBold', 'sum'),
        EarlyImprove=('EarlyImprove', 'sum'),
        AGE_eBold=('AGE', 'mean'),
        NANALYST_eBold = ('ANALYS', 'nunique'),
        CURR=('CURR', lambda x: x.iloc[0])  # Extract the first value

    ).reset_index()

    # Perform calculations for eBold, and eImprove 
    summary['EBOLD_Total'] = summary['EarlyBold'] / summary['BOLD_Total']
    summary['EIMPROVE_Total'] = summary['EarlyImprove'] / summary['IMPROVE_Total']

    # Finish the dataset by only keeping variables of interest
    df_eBold = summary[['CUSIP', 'FPEDATS', 'AGE_eBold', 'OBS_eBold', 'NANALYST_eBold', 'EBOLD_Total', 'EIMPROVE_Total', 'BOLD_Total', 'IMPROVE_Total', 'CURR']]

    # output the trimmed DataFrame to a CSV file so I can view it
    df_eBold.to_csv('output_IBES_eBold_curr.csv', index=False)

     # Record the end time
    end_time_e = time.time()

    # Calculate the elapsed time
    elapsed_time_e = end_time_e - start_time_e

    # Print the elapsed time
    print("Elapsed time:", elapsed_time_e, "seconds for all ebold/eimprove") 

    return df_eBold


create_eBold_eImprove(df_estimates, df_actuals)