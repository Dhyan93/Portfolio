import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { BankDetails } from './models/bankDetails.model';
import { Country } from './models/country.model';
import { State } from './models/state.model';
import { City } from './models/city.model';
import { AdminProfileModule } from './adminProfile/adminProfile.module';
import { HrProfileModule } from './hrProfile/hrProfile.module';
import { Documents } from './models/documents.model';
import { EmergencyContact } from './models/emergencyContact.model';
import { Qualification } from './models/qualification.model';
import { EducationDetails } from './models/educationDetails.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Address } from './models/address.model';
import { ReportTo } from './models/reportTo.model';
import { CasualLeave } from './models/casualLeave.model';
import { AuthUser } from './models/authUser.model';
import { Technology } from './models/technology.model';
import { DocumentsName } from './models/documentName.model';
import { UserDetails } from './models/userDetails.model';
import { SupportIssues } from './models/supportIssue.model';
import { Support } from './models/support.model';
import { ResourcesDetails } from './models/resourcesDetails.model';
import { Resources } from './models/resources.model';
import { ResourcesAssign } from './models/resourcesAssign.model';
import { Recruitment } from './models/recruitment.model';
import { Leave } from './models/leave.model';
import { FeedBack } from './models/feedBack.model';
import { Course } from './models/course.model';
import { CountOfDataModule } from './countOfData/countOfData.module';
import { ListOfDataModule } from './listOfData/listOfData.module';
import { DocumentModule } from './document/document.module';
import { TaskSheet } from './models/taskSheet.model';
import { TimeSheet } from './models/timeSheet.model';
import { Project } from './models/project.model';
import { CompOfLeave } from './models/compOfLeave.model';
import { ResourcesModule } from './resources/resources.module';
import { ResourceConfiguration } from './models/resourceConfiguration.model';
import { ConfigurationModule } from './configuration/configuration.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { BankDetailsModule } from './bankDetails/bankDetails.module';
import { EmployeeModule } from './employee/employee.module';
import { TaskSheetModule } from './tasksheet/taskSheet.module';
import { TaskSheetOfSeniorsModule } from './tasksheet-of-seniors/tasksheet-of-seniors.module';
import { Topic } from './models/topic.model';
import { ItpModule } from './itp/itp.module';
import { UserCourse } from './models/userCourse.model';
import { ProjectModule } from './project/project.module';
import { ProjectAssignTo } from './models/projectAssignTo.model';
import { LeaveModule } from './leave/leave.module';
import { CompOfLeaveDetail } from './models/compOfLeaveDetail.model';
import { SupportModule } from './support/support.module';
import { ClientProject } from './models/clientProjects.model';
import { Client } from './models/client.model';
import { ClientProjectModule } from './clientProject/clientProject.module';
import { CompanyModule } from './company/company.module';
import { ReportModule } from './report/report.module';
import { ProjectPaymentModule } from './project-payment/projectPayment.module';
import { ProjectPayment } from './models/projectPayment.model';
import { AlisedModule } from './alised/alised.module';
import { BDE } from './models/bde.model';
import { BdeModule } from './bde/bde.module';
import { BdeTechnology } from './models/bdeTechnology.model';
import { AlisedName } from './models/alised.model';
import { Vendor } from './models/vendor.model';
import { InterviewModule } from './interview/interview.module';
import { Interview } from './models/interview.model';
import { Link } from './models/link.model';
import { DailyUpdateModule } from './dailyUpdate/dailyUpdate.module';
import { DailyUpdate } from './models/dailyUpdate.model';
import { ItpProject } from './models/itpProject.model';
import { ItpProjectDetails } from './models/itpProjectDetails.model';
import { ItpProjectModule } from './itp-project/itp-project.module';
import { ItpProjectsAssign } from './models/itpProjectsAssign.model';
import { ScheduleModule } from '@nestjs/schedule';
import { ResourcesManage } from './models/resourcesManage.model';
import { Company } from './models/company.model';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: false,
      models: [
        AuthUser,
        ReportTo,
        CasualLeave,
        Technology,
        Country,
        State,
        City,
        Address,
        BankDetails,
        DocumentsName,
        Documents,
        EducationDetails,
        EmergencyContact,
        Qualification,
        UserDetails,
        SupportIssues,
        Support,
        ResourcesDetails,
        Resources,
        ResourcesAssign,
        Recruitment,
        Leave,
        FeedBack,
        Course,
        TaskSheet,
        TimeSheet,
        Project,
        CompOfLeave,
        Topic,
        UserCourse,
        ProjectAssignTo,
        ResourceConfiguration,
        CompOfLeaveDetail,
        ClientProject,
        Client,
        Company,
        ProjectPayment,
        BDE,
        BdeTechnology,
        AlisedName,
        Vendor,
        Interview,
        Link,
        DailyUpdate,
        ItpProject,
        ItpProjectDetails,
        ItpProjectsAssign,
        ResourcesManage,   
      ],
    }),
    MulterModule.register({
      dest: './public/uploads',
    }),
    AdminProfileModule,
    HrProfileModule,
    CountOfDataModule,
    DocumentModule,
    ListOfDataModule,
    ResourcesModule,
    ConfigurationModule,
    LeaveModule,
    BankDetailsModule,
    EmployeeModule,
    TaskSheetModule,
    TaskSheetOfSeniorsModule,
    ProjectModule,
    DashboardModule,
    SupportModule,
    ItpModule,
    RecruitmentModule,
    ClientProjectModule,
    CompanyModule,
    ReportModule,
    ProjectPaymentModule,
    AlisedModule,
    BdeModule,
    InterviewModule,
    DailyUpdateModule,
    ItpProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
