var module = angular.module('services.tooltip', []);
module.factory('TooltipService', function($sce, $rootScope, $translate, $filter) {
    return{
        createTooltips: function(){
            var options;
            $rootScope.$on('$translateChangeSuccess', function () {
                options = {
                    "toolTipForNewClient":  $sce.trustAsHtml($filter('translate')('Client is an organization, department or project with a list of vacancies to be filled') + '</br></br>'
                        + $filter('translate')('To add a vacancy, you need to create a Client first')+ '</br></br>'
                        + $filter('translate')("Fill Clients; profiles and you will be able to see their active/inactive vacancies' list, description, contacts, status, attachments, and responsible users")+ '</br></br>'
                        + $filter('translate')('Also, you can add tasks and comments for Clients')),
                    "scopeTooltip":  $sce.trustAsHtml($filter('translate')('Set the scope of visible data (vacancies, candidates, clients and users) in your interface: region, responsibility and company (if you have more than one CleverStaff account)')),
                    "addTabFacebook":  $sce.trustAsHtml($filter('translate')('Create a ‘Jobs’ tab on your company Facebook page and publish active vacancies from your CleverStaff account') + '</br></br>'
                        + $filter('translate')('NOTE: As a Facebook API has one-end integration, you should re-publish your vacancies if you want to change them') + '</br></br>'
                        + '<img src="images/sprite/download_27.6.2016_in_12_19_54.png" alt=""/>'),
                    "describeAdmin": $sce.trustAsHtml($filter('translate')("Full control on a company account. Able to manage users, clients, vacancies, and candidates. Paid user")+'<br/></br>' + $filter('translate')("Your role at your company account could be changed only by Administrator")),
                    "describeRecruiter": $sce.trustAsHtml($filter('translate')("Able to manage clients, vacancies and candidates. Paid user")+'<br/></br>' + $filter('translate')("Your role at your company account could be changed only by Administrator")),
                    "describeClient": $sce.trustAsHtml($filter('translate')("Has an access only to vacancies and candidates he/she is responsible for. Free user, unlimited number")+'<br/></br>' + $filter('translate')("Your role at your company account could be changed only by Administrator")),
                    "describeSalesmanager": $sce.trustAsHtml($filter('translate')("Able to manage clients and vacancies he/she is responsible for. Paid user")+'<br/></br>' + $filter('translate')("Your role at your company account could be changed only by Administrator")),
                    "describeFreelancer": $sce.trustAsHtml($filter('translate')("Cannot see the full database. Able to manage only clients, vacancies, and candidates he/she is responsible for. Paid user")+'<br/></br>' + $filter('translate')("Your role at your company account could be changed only by Administrator")),
                    "describeResearcher": $sce.trustAsHtml($filter('translate')("Cannot see the full database and other users. Able to see only vacancies he/she responsible for and candidates he/she added. Paid user")+'<br/></br>' + $filter('translate')("Your role at your company account could be changed only by Administrator")),
                    "addContactInvite": $sce.trustAsHtml($filter('translate')("Has an access only to vacancies and candidates he/she is responsible for. Free user, unlimited number")),
                    "unlinkProfile": $sce.trustAsHtml($filter('translate')("When you add a candidate from LinkedIn / job boards, you merge data from these sources to a candidate profile at CleverStaff.") + '<br/></br>' + $filter('translate')("To unlinck the candidate from his/her CleverStaff profile click on the appropriate icon when pointing on the 'Linked profiles'.")),
                    "fbNewsModal": $sce.trustAsHtml($filter('translate')("This is a notification for important news you should know as our user") + '<br/></br>' + $filter('translate')("To close the notification please click the button below")),
                    "timeLimit": $sce.trustAsHtml($filter('translate')("You can limit the time for passing the test.") + '</br>' + $filter('translate')("The timer will start since a candidate clicks on the 'Start test' button.") + '</br>' + $filter('translate')("If the time flies before candidates finishes the test, all filled fields will be saved.")),
                    "changePoints": $sce.trustAsHtml($filter('translate')("Enter a numeric value from 0 to 1000.") + '</br>' + $filter('translate')("This field is not obligatory.")),
                    "statCandidateAdded": $sce.trustAsHtml($filter('translate')("The left number shows candidates added by each user and the % of all added candidates in this account.") + '</br>' + $filter('translate')("The right number shows candidates without name/contacts and the % of all candidates added by this user.")),
                    "showTooltipTrial" : $sce.trustAsHtml($filter('translate')("Days left until your trial expires") + '</br>' + $filter('translate')("All features are unlimited within your trial. You could invite unlimited number of users to test the system.") + '</br>' +  $filter('translate')('If your account will not be paid until trial end date:') + '</br>'
                        + '<ul>' + '<li>' + $filter('translate')("it will be automatically changed to ‘1 RECRUITER’ plan with limited features;") + '</li>' + '<li>' + $filter('translate')("all invited users will be blocked until account is paid.") +'</li>'+'</ul>'),
                    "statisticTooltip": $sce.trustAsHtml($filter('translate')('\'Statistics\' report shows the results of every account user: the quantity and the percentage of added candidates, vacancies, interviews, an average time to fill a vacancy for a specific time period.')),
                    "mailingTopic": $sce.trustAsHtml('Your letter topic, receiver will read in his Inbox'),
                    "toolTipForTestResults": $sce.trustAsHtml($filter('translate')('Percentile shows the percent of candidates, who received fewer points for passing the test, than a specific candidate with the percentile value')),
                    "mailingInternal": $sce.trustAsHtml('Mailing name for your internal usage. Visible only for you.'),
                    "profilesMerge": $sce.trustAsHtml($filter("translate")("The 'rules' of profiles merge") + '<ul>' + '<li>' + $filter("translate")("Only fields with different values are available for selection") + '</li>' + '<li>' + $filter("translate")("If the same field in both profiles has empty and filled values, the filled value will be saved in the merged profile by default") + '</li>' + '<li>' + $filter("translate")("Tags in the merged profile will be saved from both original ones") + '</li>' + '</ul>'),
                    "helpWindowZip1":  $sce.trustAsHtml($filter('translate')('You can just upload all resumes in one big folder and pack') + '</br></br>' + '<img src="../images/sprite/ZipArchive2.png" alt=""/>'),
                    "helpWindowZip2":  $sce.trustAsHtml($filter('translate')('If your resumes folders like in the picture:') + '</br></br>' + '<img src="../images/sprite/ZipArchive1.png" alt=""/>' + '</br></br>' + $filter('translate')('simply pack the root folder in the ZIP-archive. This is a good option')),
                    "helpWindowZip3":  $sce.trustAsHtml($filter('translate')('If you have any candidates in the program E-Staff, they can be exported in two steps') + '</br></br>' + '<div>1.' + $filter('translate')('Create a script export (Menu -> Tools -> Administration -> Other -> Scripts exports). Uploaded types of objects - the candidate. Specify the name of the script and save')+'.' + '</br></br>2.' + $filter('translate')('Upload (Menu -> Tools -> Export -> Your script that you received from p.1. You will receive a folder with files of the candidate-0x0A1234E567C890A0.xml. All you need to pack a folder in the ZIP-archive and send it here. So the candidates of the E-Staff will take a CleverStaff.')),
                    "boolSearchInfo": $sce.trustAsHtml($filter('translate')('Boolean search info')),
                    "exchangeHost":  $sce.trustAsHtml($filter('translate')('The Exchange server URL')),
                    "exchangeDomain":  $sce.trustAsHtml($filter('translate')('Domain/username is the required field for those cases when logging into an account for exchange via Domain/username, rather than an email address')),
                    "hmInvite":  $sce.trustAsHtml($filter('translate')('Hiring Manager will be responsible for this vacancy after registration in account.')),
                    "reportWithCandidatesActions":  $sce.trustAsHtml($filter('translate')('Number of candidates for which there were actions for the selected period')),
                    "userInvite": {
                        "admin" : $sce.trustAsHtml($filter('translate')('Full control on a company account. Able to manage users, clients, vacancies, and candidates. Paid user')),
                        "recruter" : $sce.trustAsHtml($filter('translate')('Able to manage clients, vacancies and candidates. Paid user')),
                        "freelancer" : $sce.trustAsHtml($filter('translate')('Cannot see the full database. Able to manage only clients, vacancies, and candidates he/she is responsible for. Paid user')),
                        "researcher" : $sce.trustAsHtml($filter('translate')('Cannot see the full database and other users. Able to see only vacancies he/she responsible for and candidates he/she added')),
                        "client" : $sce.trustAsHtml($filter('translate')('Has an access only to vacancies and candidates he/she is responsible for. Free user, unlimited number'))
                    },
                    "filterCostructorInfo": $sce.trustAsHtml($filter('translate')('The filter allows you to pick the users who performed any activities on vacancies.'))
                };
                $rootScope.tooltips = options;
            });
        }
    }
});