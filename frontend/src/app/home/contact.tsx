import background from "../../assets/landing.jpg";

function Contact() {
  return (
    <>
      <div
        style={{
          // borderRadius: "50px 50px 50px 50px",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "100vh",
          width: "100%",
        }}
        className="flex flex-col justify-center items-center"
      >
        <h1
          className="text-white text-6xl m-4 font-mono font-bold
"
        >
          Contact
        </h1>
        <p className="text-white font-thin italic"></p>
        <p className="text-white text-center font-thin my-10 w-3/4"></p>
      </div>
    </>
  );
}

export default Contact;
