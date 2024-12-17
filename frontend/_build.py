import shutil


frontend_build_path = "./build/";
backend_path = "./../backend/";
final_build_path = "./../build/";

shutil.rmtree(final_build_path)
shutil.copytree(frontend_build_path,final_build_path, dirs_exist_ok=True)
shutil.copytree(backend_path,final_build_path,dirs_exist_ok=True)
