import React from "react";
const About = () => {
  return (
    <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl text-center">
          About Us
        </h2>
        <div className="mt-6 text-gray-600">
          <p className="text-lg">
            Welcome to our restaurant! We pride ourselves on serving delicious
            meals made with the freshest ingredients sourced locally.
          </p>
          <p className="mt-4">
            Our team of experienced chefs creates mouthwatering dishes that will
            tantalize your taste buds.
          </p>
          <p className="mt-4">
            Whether you're looking for a cozy dinner for two or planning a
            special event, we have the perfect ambiance to make your dining
            experience unforgettable.
          </p>
          <p className="mt-4">
            Join us today and indulge in a culinary journey like no other!
          </p>
        </div>
      </div>
    </div>
  );
};
export default About;
