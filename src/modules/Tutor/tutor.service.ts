
import { User } from "../../../generated/prisma/client";
import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"


const getAllTutorIntoDB=async(userId:string)=>{


  const user=await prisma.user.findUnique({
    where:{
      id:userId,
    },
  });
  if(!user){
    throw new Error ("User not found!!")
  }
  const result =await prisma.tutorProfiles.findUniqueOrThrow({
    where:{
      tutorId:user.id,
    },
    include:{
      user:true
    },
  });

  return result;
};



const updateBookingStatusIntoDB=async(status:BookingStatus,bookingId:string)=>{
  const result = await prisma.booking.update({
    where:{
      id:bookingId,
    },
    data:{
      status:status,

    },
  });
  return result;
};


const createTutorIntoDB=async(payLoad:any,userId:string)=>{

  const user=await prisma.user.findUnique({
    where:{
      id:userId,
    },
  });
  if(!user){
    throw new Error ("User not found")
  }
  const result= await prisma.tutorProfiles.create({
    data:{...payLoad,tutorId:user.id},
  });
  return result;
};

//  tutorId:user
// userId: user.id


const getSingleSitterIntoDB=async(tutorId:string)=>{
  const result = await prisma.tutorProfiles.findUnique({
    where:{
      id:tutorId
    },
  
  });
  return result;
}


const updateTutorSubjects = async (subjectIds: string[], user: User) => {
    
    const tutorProfile = await prisma.tutorProfiles.findUnique({
        where: {
            tutorId: user.id
        },
        include: {
            categories: true 
        }
    });

    if (!tutorProfile) {
        throw new Error("Tutor profile not found");
    }

  
    const tutorCategoryIds = tutorProfile.categories.map(c => c.id);

    if (tutorCategoryIds.length === 0) {
        throw new Error("Tutor profile has no categories assigned");
    }

    const subjects = await prisma.subject.findMany({
        where: {
            id: { in: subjectIds }
        }, 
        select: {
            id: true,
            categoryId: true
        }
    });

    if (subjects.length !== subjectIds.length) {
        throw new Error("One or more subjects are invalid");
    }

   
    const invalidSubject = subjects.find(
        (s) => !tutorCategoryIds.includes(s.categoryId)
    );

    if (invalidSubject) {
       throw new Error("You selected a subject outside your category");
    }

    return await prisma.$transaction(async (tx) => {
      
        await tx.tutorSubject.deleteMany({
            where: {
                tutorId: tutorProfile.id
            }
        });

        const data = subjectIds.map(subjectId => ({
            tutorId: tutorProfile.id, 
            subjectId
        }));

       
        return await tx.tutorSubject.createManyAndReturn({
            data
        });
    });
}




export const TutorService={
  createTutorIntoDB,
  getAllTutorIntoDB,
  getSingleSitterIntoDB,
  updateTutorSubjects,
  updateBookingStatusIntoDB
}